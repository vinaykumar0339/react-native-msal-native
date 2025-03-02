package com.msalnative

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap

class MsalNativeModule(context: ReactApplicationContext): ReactContextBaseJavaModule(context) {
    private var implementation: MsalNativeModuleImpl = MsalNativeModuleImpl(context)

    companion object {
        const val NAME = "MsalNative"
    }

    override fun createPublicClientApplication(config: ReadableMap?, promise: Promise?) {
        implementation.createPublicClientApplication(config, promise)
    }

    override fun acquireToken(config: ReadableMap?, promise: Promise?) {
      implementation.acquireToken(config, promise)
    }

    override fun acquireTokenSilent(config: ReadableMap?, promise: Promise?) {
      implementation.acquireTokenSilent(config, promise)
    }

    override fun cancelCurrentWebAuthSession(promise: Promise?) {
        TODO("Not yet implemented")
    }

    override fun allAccounts(promise: Promise?) {
        implementation.allAccounts(promise)
    }

    override fun account(config: ReadableMap?, promise: Promise?) {
      implementation.account(config, promise)
    }

    override fun getCurrentAccount(promise: Promise?) {
      implementation.getCurrentAccount(promise)
    }

    override fun removeAccount(config: ReadableMap?, promise: Promise?) {
        TODO("Not yet implemented")
    }

    override fun signOut(config: ReadableMap?, promise: Promise?) {
        TODO("Not yet implemented")
    }

    override fun setBrokerAvailability(type: String?) {
        TODO("Not yet implemented")
    }

    override fun isCompatibleAADBrokerAvailable(promise: Promise?) {
      implementation.isCompatibleAADBrokerAvailable(promise)
    }

    override fun sdkVersion(promise: Promise?) {
      implementation.sdkVersion(promise)
    }
}
