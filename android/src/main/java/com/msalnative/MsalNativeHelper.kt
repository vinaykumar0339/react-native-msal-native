package com.msalnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.microsoft.identity.client.AuthenticationScheme
import com.microsoft.identity.client.BearerAuthenticationScheme
import com.microsoft.identity.client.HttpMethod
import com.microsoft.identity.client.PoPAuthenticationScheme
import com.microsoft.identity.client.Prompt
import java.net.URL
import java.util.Objects

object MsalNativeHelper {

  fun getPromptType(promptType: String?): Prompt {
    return when(promptType) {
      PromptSelectAccount -> Prompt.SELECT_ACCOUNT
      PromptLogin -> Prompt.LOGIN
      PromptConsent -> Prompt.CONSENT
      PromptWhenRequired -> Prompt.WHEN_REQUIRED
      else -> Prompt.SELECT_ACCOUNT
    }
  }

  private fun getHttpMethod(httpMethod: String): HttpMethod {
    return when (httpMethod.uppercase()) {
      "HEAD" -> HttpMethod.HEAD
      "POST" -> HttpMethod.POST
      "PUT" -> HttpMethod.PUT
      "DELETE" -> HttpMethod.DELETE
      "PATCH" -> HttpMethod.PATCH
      "CONNECT" -> HttpMethod.CONNECT
      "OPTIONS" -> HttpMethod.OPTIONS
      "TRACE" -> HttpMethod.TRACE
      else -> HttpMethod.GET
    }
  }

  fun authenticationSchemeFromConfig(config: ReadableMap): AuthenticationScheme {
    val scheme = config.getString("scheme")

    if (Objects.equals(scheme, AuthSchemeBearer)) {
     return BearerAuthenticationScheme()
    } else if (Objects.equals(scheme, AuthSchemePop)) {
      val popAuthenticationSchemeBuilder = PoPAuthenticationScheme.builder()

      // httpMethod
      if (config.hasKey("httpMethod")) {
        val httpMethod = config.getString("httpMethod")
        httpMethod?.let {
          popAuthenticationSchemeBuilder.withHttpMethod(getHttpMethod(it))
        }
      }

      // requestUrl
      if (config.hasKey("requestUrl")) {
        val requestUrl = config.getString("requestUrl")
        requestUrl?.let {
          popAuthenticationSchemeBuilder.withUrl(URL(it))
        }
      }

      // nonce
      if (config.hasKey("nonce")) {
        val nonce = config.getString("nonce")
        nonce?.let {
          popAuthenticationSchemeBuilder.withNonce(it)
        }
      }

      // clientClaims
      if (config.hasKey("clientClaims")) {
        val additionalParameters = config.getString("clientClaims")
        additionalParameters?.let {
          popAuthenticationSchemeBuilder.withClientClaims(additionalParameters)
        }
      }

      return popAuthenticationSchemeBuilder.build()

    }

    return BearerAuthenticationScheme()
  }

  fun convertDictionary(map: Map<*, *>?): WritableMap {
    val writableMap = Arguments.createMap()
    map?.forEach { (key, value) ->
      when (value) {
        is String -> writableMap.putString(key.toString(), value)
        is Int -> writableMap.putInt(key.toString(), value)
        is Double -> writableMap.putDouble(key.toString(), value)
        is Boolean -> writableMap.putBoolean(key.toString(), value)
        is Map<*, *> -> {
          // Safe cast to Map<String, *> before passing
          val safeMap = value as? Map<*, *> ?: emptyMap<String, String>()
          writableMap.putMap(key.toString(), convertDictionary(safeMap))
        }
        is List<*> -> writableMap.putArray(key.toString(), convertArray(value))
        else -> writableMap.putString(key.toString(), value?.toString()) // Fallback to string
      }
    }
    return writableMap
  }

  fun convertArray(list: List<*>): WritableArray {
    val writableArray = Arguments.createArray()
    list.forEach { value ->
      when (value) {
        is String -> writableArray.pushString(value)
        is Int -> writableArray.pushInt(value)
        is Double -> writableArray.pushDouble(value)
        is Boolean -> writableArray.pushBoolean(value)
        is Map<*, *> -> {
        // Safe cast to Map<String, *> before passing
        val safeMap = value as? Map<*, *> ?: emptyMap<String, String>()
        writableArray.pushMap(convertDictionary(safeMap))
      }
        is List<*> -> writableArray.pushArray(convertArray(value))
        else -> writableArray.pushString(value?.toString()) // Fallback to string
      }
    }
    return writableArray
  }
}
