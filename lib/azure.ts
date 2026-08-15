export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export function azureConfig() {
  const endpoint = (process.env.AZURE_OPENAI_ENDPOINT || "").replace(/\/+$/, "");
  const apiKey =
    process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_OPENAI_KEY || "";
  const deployment =
    process.env.AZURE_OPENAI_DEPLOYMENT ||
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME ||
    "gpt-4o";
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-10-21";

  return { endpoint, apiKey, deployment, apiVersion };
}

export function isAzureConfigured() {
  const { endpoint, apiKey, deployment } = azureConfig();
  return Boolean(endpoint && apiKey && deployment);
}

export function azureChatUrl() {
  const { endpoint, deployment, apiVersion } = azureConfig();
  return `${endpoint}/openai/deployments/${encodeURIComponent(deployment)}/chat/completions?api-version=${encodeURIComponent(apiVersion)}`;
}

export function publicAzureStatus() {
  const configured = isAzureConfigured();
  const { deployment, apiVersion } = azureConfig();
  return {
    configured,
    mode: configured ? ("azure" as const) : ("local" as const),
    deployment: configured ? deployment : null,
    apiVersion: configured ? apiVersion : null,
  };
}
