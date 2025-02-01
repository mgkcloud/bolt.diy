import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class AzureProvider extends BaseProvider {
  name = 'Azure AI Foundry';
  getApiKeyLink = 'https://ai.azure.com/';

  config = {
    apiTokenKey: 'AZURE_API_KEY',
  };

  // find more in https://github.com/marketplace?type=models
  staticModels: ModelInfo[] = [
    { name: 'deepseek-reasoner', label: 'deepseek-reasoner', provider: 'Azure', maxTokenAllowed: 100000 },
  ];

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'https://photon.westus3.models.ai.azure.com/v1',
      defaultApiTokenKey: 'AZURE_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const openai = createOpenAI({
      baseURL: 'https://photon.westus3.models.ai.azure.com/v1',
      apiKey,
    });

    return openai(model);
  }
}
