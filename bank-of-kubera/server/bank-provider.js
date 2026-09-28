function getProviderStatus() {
  return {
    provider: "OneMoney",
    providerId: "onemoney",
    country: "IN",
    connected: false,
    available: false,
    setupState: "awaiting_fiu_onboarding",
    message: "OneMoney India is selected. Live linking requires FIU onboarding and the provider's official API or SDK specification.",
  };
}

module.exports = { getProviderStatus };