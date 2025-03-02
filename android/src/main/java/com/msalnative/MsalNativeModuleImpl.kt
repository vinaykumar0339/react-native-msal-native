package com.msalnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.microsoft.identity.client.AcquireTokenParameters
import com.microsoft.identity.client.AuthenticationCallback
import com.microsoft.identity.client.IAuthenticationResult
import com.microsoft.identity.client.IPublicClientApplication
import com.microsoft.identity.client.IPublicClientApplication.ApplicationCreatedListener
import com.microsoft.identity.client.Prompt
import com.microsoft.identity.client.PublicClientApplication
import com.microsoft.identity.client.exception.MsalException
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.FileWriter
import java.io.IOException


class MsalNativeModuleImpl(private val context: ReactApplicationContext) {

  private var publicClientApplication: IPublicClientApplication? = null

  fun getName(): String {
    return NAME
  }

  private fun getAudienceJsonObject(audience: ReadableMap?): JSONObject {
    val audienceJsonObject = JSONObject()
    // type
    if (audience?.hasKey("type") == true) {
      val type = audience.getString("type")
      audienceJsonObject.put("type", type)
    }

    // tenantId
    if (audience?.hasKey("tenantId") == true) {
      val tenantId = audience.getString("tenantId")
      audienceJsonObject.put("tenant_id", tenantId)
    }
    return audienceJsonObject
  }

  private fun getAuthorityJsonObject(authority: ReadableMap?): JSONObject {
    val authorityJsonObject = JSONObject()
    // type
    if (authority?.hasKey("type") == true) {
      val type = authority.getString("type")
      authorityJsonObject.put("type", type)
    }

    // default
    if (authority?.hasKey("default") == true) {
      val default = authority.getBoolean("default")
      authorityJsonObject.put("default", default)
    }

    // authorityUrl
    if (authority?.hasKey("authorityUrl") == true) {
      val authorityUrl = authority.getString("authorityUrl")
      authorityJsonObject.put("authority_url", authorityUrl)
    }

    // audience
    if (authority?.hasKey("audience") == true) {
      val audience = authority.getMap("audience")
      authorityJsonObject.put("audience", getAudienceJsonObject(audience))
    }
    return authorityJsonObject
  }

  private fun getHttpJsonObject(http: ReadableMap?): JSONObject {
    val httpJsonObject = JSONObject()
    // connectTimeout
    if (http?.hasKey("connectTimeout") == true) {
      val connectTimeout = http.getInt("connectTimeout")
      httpJsonObject.put("connect_timeout", connectTimeout)
    }

    // readTimeout
    if (http?.hasKey("readTimeout") == true) {
      val readTimeout = http.getInt("readTimeout")
      httpJsonObject.put("read_timeout", readTimeout)
    }
    return httpJsonObject
  }

  private fun getLoggingJsonObject(logging: ReadableMap?): JSONObject {
    val loggingJsonObject = JSONObject()
    // piiEnabled
    if (logging?.hasKey("piiEnabled") == true) {
      val piiEnabled = logging.getBoolean("piiEnabled")
      loggingJsonObject.put("pii_enabled", piiEnabled)
    }

    // logLevel
    if (logging?.hasKey("logLevel") == true) {
      val logLevel = logging.getString("logLevel")
      loggingJsonObject.put("log_level", logLevel)
    }

    // logcatEnabled
    if (logging?.hasKey("logcatEnabled") == true) {
      val logcatEnabled = logging.getBoolean("logcatEnabled")
      loggingJsonObject.put("logcat_enabled", logcatEnabled)
    }
    return loggingJsonObject
  }

  @Throws(Exception::class)
  private fun createPublicClientApplicationConfigFile(config: ReadableMap?) : File {
    val jsonObject = JSONObject()

    // clientId
    if(config?.hasKey("clientId") == true) {
      val clientId = config.getString("clientId")
      jsonObject.put("client_id", clientId)
    }

    // redirectUri
    if (config?.hasKey("redirectUri") == true) {
      val redirectUri = config.getString("redirectUri")
      jsonObject.put("redirect_uri", redirectUri)
    }

    // brokerRedirectUriRegistered
    if (config?.hasKey("brokerRedirectUriRegistered") == true) {
      val brokerRedirectUri = config.getBoolean("brokerRedirectUriRegistered")
      jsonObject.put("broker_redirect_uri_registered", brokerRedirectUri)
    }

    // authorities
    if (config?.hasKey("authorities") == true) {
      val authorities = config.getArray("authorities")
      authorities?.let {
        val authoritiesArray = JSONArray()
        for (i in 0 until it.size()) {
          val authorityMap = it.getMap(i)
          authorityMap?.let { authority ->
            authoritiesArray.put(getAuthorityJsonObject(authority))
          }
        }
        jsonObject.put("authorities", authoritiesArray)
      }
    }

    // authorizationUserAgent
    if (config?.hasKey("authorizationUserAgent") == true) {
      val authorizationUserAgent = config.getString("authorizationUserAgent")
      jsonObject.put("authorization_user_agent", authorizationUserAgent)
    }

    // multipleCloudsSupported
    if (config?.hasKey("multipleCloudsSupported") == true) {
      val multipleCloudsSupported = config.getBoolean("multipleCloudsSupported")
      jsonObject.put("multiple_clouds_supported", multipleCloudsSupported)
    }

    // http
    if (config?.hasKey("http") == true) {
      val http = config.getMap("http")
      http?.let {
        jsonObject.put("http", getHttpJsonObject(it))
      }
    }

    // logging
    if (config?.hasKey("logging") == true) {
      val logging = config.getMap("logging")
      logging?.let {
        jsonObject.put("logging", getLoggingJsonObject(it))
      }
    }

    // accountMode
    if (config?.hasKey("accountMode") == true) {
      val accountMode = config.getString("accountMode")
      jsonObject.put("account_mode", accountMode)
    }

    // browserSafelist
    if (config?.hasKey("browserSafelist") == true) {
      val browserSafelist = config.getMap("browserSafelist")
      jsonObject.put("browser_safelist", browserSafelist)
    }

    // Define a fixed file in cache directory
    val tempFile = File(context.cacheDir, "msal_config.json")

    val jsonConfig = jsonObject.toString(4) // Pretty print JSON

    FileWriter(tempFile, false).use { writer ->  // 'false' overwrites instead of appending
      writer.write(jsonConfig)
    }
    return tempFile
  }

  private fun getWritableMapFromException(exception: MsalException): WritableMap {
    val map = Arguments.createMap()
    map.putString("errorCode", exception.errorCode)
    map.putString("errorMessage", exception.message)
    map.putString("errorDescription", exception.localizedMessage)
    map.putString("cliTelemErrorCode", exception.cliTelemErrorCode)
    map.putString("cliTelemSubErrorCode", exception.cliTelemSubErrorCode)
    map.putString("correlationId", exception.correlationId)
    map.putString("exceptionName", exception.exceptionName)
    map.putString("speRing", exception.speRing)
    map.putString("username", exception.username)
    map.putString("refreshTokenAge", exception.refreshTokenAge)
    return map
  }

  fun createPublicClientApplication(config: ReadableMap?, promise: Promise?) {
    try {
      val configFile = createPublicClientApplicationConfigFile(config)
      PublicClientApplication.create(context, configFile, object : ApplicationCreatedListener {
        override fun onCreated(application: IPublicClientApplication?) {
          publicClientApplication = application
          promise?.resolve("successfully created public client application")
        }

        override fun onError(exception: MsalException?) {
          var map: WritableMap? = null
          if (exception != null) {
            map = getWritableMapFromException(exception)
          }
          promise?.reject(
            "APPLICATION_CREATION_ERROR",
            exception?.localizedMessage,
            exception,
            map
          )
        }
      })
    } catch (e: Exception) {
      promise?.reject(
        "APPLICATION_CREATION_ERROR",
        "Error Creating Public Client Application. For more info check the error object",
        e
      )
    }
  }

  private fun getScopesFromReadableArray(scopes: ReadableArray): List<String> {
    val mutableScopes = mutableListOf<String>()
    for (i in 0 until scopes.size()) {
      scopes.getString(i)?.let { it1 -> mutableScopes.add(it1) }
    }
    return mutableScopes
  }

  fun acquireToken(config: ReadableMap?, promise: Promise?) {
    publicClientApplication?.let {
      // Acquire token
      val acquireTokenParametersBuilder = AcquireTokenParameters.Builder()
      acquireTokenParametersBuilder.startAuthorizationFromActivity(context.currentActivity)

      // scopes
      if (config?.hasKey("scopes") == true) {
        val scopes = config.getArray("scopes")
        scopes?.let { sco ->
          acquireTokenParametersBuilder.withScopes(getScopesFromReadableArray(sco))
        }
      }

      // extraQueryParameters
      if (config?.hasKey("extraQueryParameters") == true) {
        val extraQueryParameters = config.getMap("extraQueryParameters")
        val extraQueryParametersMap = mutableMapOf<String, String>()
        extraQueryParameters?.toHashMap()?.forEach { (key, value) ->
          extraQueryParametersMap[key] = value.toString()
        }
        acquireTokenParametersBuilder.withAuthorizationQueryStringParameters(extraQueryParametersMap.entries.toMutableList())
      }

      // extraScopesToConsent
      if (config?.hasKey("extraScopesToConsent") == true) {
        val extraScopesToConsent = config.getArray("extraScopesToConsent")
        extraScopesToConsent?.let { extraScopes ->
          acquireTokenParametersBuilder.withOtherScopesToAuthorize(getScopesFromReadableArray(extraScopes))
        }
      }

      // loginHint
      if (config?.hasKey("loginHint") == true) {
        val loginHint = config.getString("loginHint")
        acquireTokenParametersBuilder.withLoginHint(loginHint)
      }

      // promptType
      if (config?.hasKey("promptType") == true) {
        val promptType = config.getString("promptType")
        acquireTokenParametersBuilder.withPrompt(MsalNativeHelper.getPromptType(promptType))
      }

      // authenticationScheme
      if (config?.hasKey("authenticationScheme") == true) {
        val authenticationScheme = config.getMap("authenticationScheme")
        authenticationScheme?.let { scheme ->
          acquireTokenParametersBuilder.withAuthenticationScheme(MsalNativeHelper.authenticationSchemeFromConfig(scheme))
        }
      }

      // callbacks
      acquireTokenParametersBuilder.withCallback(object : AuthenticationCallback {
        override fun onSuccess(authenticationResult: IAuthenticationResult?) {
          authenticationResult?.let { result ->
            promise?.resolve(MsalModelHelper.convertMsalResultToDictionary(result))
          } ?: run {
            promise?.reject("ACQUIRE_TOKEN_ERROR", "Authentication result is null")
          }
        }

        override fun onError(exception: MsalException?) {
          var map: WritableMap? = null
          if (exception != null) {
            map = getWritableMapFromException(exception)
          }
          promise?.reject(
            "ACQUIRE_TOKEN_ERROR",
            exception?.localizedMessage,
            exception,
            map
          )
        }

        override fun onCancel() {
          promise?.reject("ACQUIRE_TOKEN_CANCELLED", "User cancelled the operation")
        }

      })

      val acquireTokenParameters = acquireTokenParametersBuilder.build()
      it.acquireToken(acquireTokenParameters)

    } ?: run {
      promise?.reject("NO_APPLICATION_CREATED", "Application not initialized. Make sure you called createPublicClientApplication")
    }
  }

  fun acquireTokenSilent(config: ReadableMap?, promise: Promise?) {
    TODO("Not yet implemented")
  }

  fun cancelCurrentWebAuthSession(promise: Promise?) {
    TODO("Not yet implemented")
  }

  fun allAccounts(promise: Promise?) {
    TODO("Not yet implemented")
  }

  fun account(config: ReadableMap?, promise: Promise?) {
    TODO("Not yet implemented")
  }

  fun getCurrentAccount(promise: Promise?) {
    TODO("Not yet implemented")
  }

  fun removeAccount(config: ReadableMap?, promise: Promise?) {
    TODO("Not yet implemented")
  }

  fun signOut(config: ReadableMap?, promise: Promise?) {
    TODO("Not yet implemented")
  }

  fun setBrokerAvailability(type: String?) {
    TODO("Not yet implemented")
  }

  fun isCompatibleAADBrokerAvailable(promise: Promise?) {
    TODO("Not yet implemented")
  }

  fun sdkVersion(promise: Promise?) {
    TODO("Not yet implemented")
  }

  companion object {
    const val NAME = "MsalNative"
  }
}
