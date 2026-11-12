export interface EbayGetDefaultCategoryTreeIdResponse {
  categoryTreeId: string;
  categoryTreeVersion: string;
}

export interface EbayCategoryItemConditionPolicy {
  categoryTreeId: string;
  categoryId: string;
  itemConditionRequired: boolean;
  itemConditions: {
    conditionId: string;
    conditionDescription: string;
  }[];
}

export interface EbayGetCategoryItemConditionPoliciesResponse {
  itemConditionPolicies: EbayCategoryItemConditionPolicy[];
}
