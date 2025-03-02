package com.msalnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.microsoft.identity.client.IAccount
import com.microsoft.identity.client.IAuthenticationResult
import com.microsoft.identity.client.TenantProfile
import com.msalnative.MsalNativeHelper.convertDictionary

object MsalModelHelper {
  fun convertMsalResultToDictionary(result: IAuthenticationResult): WritableMap {
    val map = Arguments.createMap()

    map.putString("accessToken", result.accessToken)
    map.putLong("expiresOn", result.expiresOn.time)

    // scopes
    val scopesArray = WritableNativeArray()
    result.scope.forEach { scopesArray.pushString(it) }
    map.putArray("scopes", scopesArray)

    // account
    map.putMap("account", convertMsalAccountToDictionary(result.account))
    result.tenantId?.let { map.putString("tenantId", it) }
    result.correlationId?.let { map.putString("correlationId", it.toString()) }
    map.putString("authorizationHeader", result.authorizationHeader)
    map.putString("authenticationScheme", result.authenticationScheme)
    return map
  }

  fun convertMsalTenantProfileToDictionary(tenantProfile: TenantProfile): WritableMap {
    val map = Arguments.createMap()

    map.putString("id", tenantProfile.id)
    map.putString("tenantId", tenantProfile.tenantId)
    map.putString("username", tenantProfile.username)
    map.putString("authority", tenantProfile.authority)
    map.putString("idToken", tenantProfile.idToken)
    map.putMap("claims", convertDictionary(tenantProfile.claims))
    return map
  }

  private fun convertMsalAccountToDictionary(account: IAccount): WritableMap {
    val map = Arguments.createMap()

    map.putString("authority", account.authority)
    map.putString("id", account.id)
    map.putString("username", account.username)
    map.putString("idToken", account.idToken)
    map.putString("tenantId", account.tenantId)
    map.putMap("claims", convertDictionary(account.claims))
    return map
  }
}
