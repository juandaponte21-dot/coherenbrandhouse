/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Service {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  details: string[];
  iconName: string;
  resultsMetric: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  metric: string;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface DynamicAuditRequest {
  businessName: string;
  niche: string;
  primaryGoal: string;
  targetBudget: string;
}
