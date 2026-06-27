export type Screen = 
  | 'welcome'
  | 'how_it_works'
  | 'results'
  | 'about'
  | 'plans_preview'
  | 'language'
  | 'language_more'
  | 'language_set'
  | 'trial_intro'
  | 'step1_experience'
  | 'step1_selected'
  | 'step2_markets'
  | 'step3_style'
  | 'step3_selected'
  | 'step4_timezone'
  | 'step4_selected'
  | 'review_settings'
  | 'activating'
  | 'welcome_registered'
  | 'tips'
  | 'first_signal'
  | 'main_menu'
  | 'live_markets'
  | 'signals_live'
  | 'signal_btc'
  | 'signal_forex'
  | 'signal_stock'
  | 'signal_gold'
  | 'signal_update_target'
  | 'signal_update_sl'
  | 'signal_closed_win'
  | 'signal_closed_loss'
  | 'morning_report'
  | 'evening_report'
  | 'weekly_report'
  | 'dashboard'
  | 'trade_history'
  | 'risk_center'
  | 'risk_settings'
  | 'position_calc'
  | 'pl_calc'
  | 'risk_guide'
  | 'academy'
  | 'academy_level1'
  | 'lesson_content'
  | 'lesson_quiz'
  | 'strategy_library'
  | 'social_trading'
  | 'trader_profile'
  | 'discussion_rooms'
  | 'subscription_plans'
  | 'annual_plans'
  | 'discount_code'
  | 'payment_method'
  | 'payment_crypto'
  | 'payment_success'
  | 'payment_failed'
  | 'manage_subscription'
  | 'settings'
  | 'notification_settings'
  | 'dnd_settings'
  | 'export_data'
  | 'delete_account'
  | 'economic_calendar'
  | 'weekly_calendar'
  | 'referral'
  | 'referral_details'
  | 'referral_withdraw'
  | 'support'
  | 'faq'
  | 'faq_signals'
  | 'ai_assistant'
  | 'news'
  | 'connect_platforms'
  | 'connect_binance'
  | 'connect_success'
  | 'auto_trade_settings'
  | 'competitions'
  | 'weekly_challenges'
  | 'trial_ended'
  | 'limited_plan'
  | 'upgrade_required'
  | 'status';

export interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  buttons?: Button[][];
  timestamp: Date;
}

export interface Button {
  label: string;
  action: string;
  color?: 'default' | 'green' | 'red' | 'gold';
}

export interface UserState {
  name: string;
  username: string;
  accountId: string;
  language: string;
  experience: string;
  markets: string[];
  tradingStyle: string;
  timezone: string;
  plan: 'trial' | 'expired' | 'starter' | 'pro' | 'elite' | 'diamond';
  trialHoursLeft: number;
  isRegistered: boolean;
}
