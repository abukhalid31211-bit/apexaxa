import { useState, useEffect, useRef, useCallback } from 'react';
import { Screen, Message, Button, UserState } from './types';
import { getScreen } from './data/screens';
import MessageBubble from './components/MessageBubble';
import InlineKeyboard from './components/InlineKeyboard';
import TypingIndicator from './components/TypingIndicator';
import TelegramHeader from './components/TelegramHeader';
import CommandBar from './components/CommandBar';

const defaultUser: UserState = {
  name: 'أبو خالد',
  username: 'trader_apex',
  accountId: 'APX-2025-47291',
  language: 'العربية',
  experience: '',
  markets: [],
  tradingStyle: '',
  timezone: '',
  plan: 'trial',
  trialHoursLeft: 48,
  isRegistered: false,
};

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  text: string;
  buttons?: Button[][];
  timestamp: Date;
}

const TYPING_DELAY = 800;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userState, setUserState] = useState<UserState>(defaultUser);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isNavigating = useRef(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const addBotMessage = useCallback((screen: Screen, updatedUser?: UserState) => {
    const user = updatedUser || userState;
    const screenData = getScreen(screen, user);
    const msgId = `msg-${Date.now()}-${Math.random()}`;

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newMsg: ChatMessage = {
        id: msgId,
        type: 'bot',
        text: screenData.text,
        buttons: screenData.buttons,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMsg]);
      setActiveMessageId(msgId);
      scrollToBottom();
    }, TYPING_DELAY);
  }, [userState, scrollToBottom]);

  const addUserMessage = useCallback((text: string) => {
    const msgId = `user-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: msgId,
      type: 'user',
      text,
      timestamp: new Date(),
    }]);
    scrollToBottom();
  }, [scrollToBottom]);

  // Initialize with welcome screen
  useEffect(() => {
    addBotMessage('welcome');
  }, []);

  const navigate = useCallback((screen: Screen, updatedUser?: UserState) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    setCurrentScreen(screen);
    // Disable previous message buttons
    setActiveMessageId(null);
    addBotMessage(screen, updatedUser);
    setTimeout(() => { isNavigating.current = false; }, TYPING_DELAY + 100);
  }, [addBotMessage]);

  const handleAction = useCallback((action: string, label: string) => {
    // Add user "click" message
    addUserMessage(label);

    // Parse action
    if (action.startsWith('goto:')) {
      const screen = action.replace('goto:', '') as Screen;
      navigate(screen);
    }
    else if (action.startsWith('set_lang:')) {
      const lang = action.replace('set_lang:', '');
      const updated = { ...userState, language: lang };
      setUserState(updated);
      navigate('language_set', updated);
    }
    else if (action.startsWith('set_exp:')) {
      const exp = action.replace('set_exp:', '');
      const updated = { ...userState, experience: exp };
      setUserState(updated);
      navigate('step1_selected', updated);
    }
    else if (action.startsWith('toggle_market:')) {
      const market = action.replace('toggle_market:', '');
      const currentMarkets = userState.markets || [];
      const newMarkets = currentMarkets.includes(market)
        ? currentMarkets.filter(m => m !== market)
        : [...currentMarkets, market];
      const updated = { ...userState, markets: newMarkets };
      setUserState(updated);
      navigate('step2_markets', updated);
    }
    else if (action === 'select_all_markets') {
      const updated = {
        ...userState,
        markets: ['كريبتو', 'فوركس', 'أسهم أمريكية', 'أسهم سعودية', 'سلع', 'مؤشرات', 'أسهم إماراتية']
      };
      setUserState(updated);
      navigate('step2_markets', updated);
    }
    // Settings-context market toggles (navigate back to settings_markets)
    else if (action.startsWith('stoggle_market:')) {
      const market = action.replace('stoggle_market:', '');
      const currentMarkets = userState.markets || [];
      const newMarkets = currentMarkets.includes(market)
        ? currentMarkets.filter(m => m !== market)
        : [...currentMarkets, market];
      const updated = { ...userState, markets: newMarkets };
      setUserState(updated);
      navigate('settings_markets', updated);
    }
    else if (action === 'select_all_markets_s') {
      const updated = {
        ...userState,
        markets: ['كريبتو', 'فوركس', 'أسهم أمريكية', 'أسهم سعودية', 'سلع', 'مؤشرات', 'أسهم إماراتية']
      };
      setUserState(updated);
      navigate('settings_markets', updated);
    }
    // Settings-context style update (navigate back to settings)
    else if (action.startsWith('sset_style:')) {
      const style = action.replace('sset_style:', '');
      const updated = { ...userState, tradingStyle: style };
      setUserState(updated);
      navigate('settings', updated);
    }
    // Settings-context experience update (navigate back to settings)
    else if (action.startsWith('sset_exp:')) {
      const exp = action.replace('sset_exp:', '');
      const updated = { ...userState, experience: exp };
      setUserState(updated);
      navigate('settings', updated);
    }
    else if (action.startsWith('set_style:')) {
      const style = action.replace('set_style:', '');
      const updated = { ...userState, tradingStyle: style };
      setUserState(updated);
      navigate('step3_selected', updated);
    }
    else if (action.startsWith('set_tz:')) {
      const tz = action.replace('set_tz:', '');
      const updated = { ...userState, timezone: tz, isRegistered: true };
      setUserState(updated);
      navigate('step4_selected', updated);
    }
    else if (action.startsWith('filter_signals:')) {
      const filter = action.replace('filter_signals:', '');
      const filterMap: Record<string, string> = {
        crypto: 'الكريبتو',
        forex: 'الفوركس',
        stocks: 'الأسهم',
        gold: 'الذهب والسلع',
        indices: 'المؤشرات',
        all: 'الكل',
      };
      const filterName = filterMap[filter] || filter;
      setTimeout(() => {
        const msgId = `filter-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: msgId,
          type: 'bot',
          text: `🔍 **فلترة الإشارات — ${filterName}**

━━━━━━━━━━━━━━━━━━━━━━━━
${filter === 'crypto' ? `🔵 **BTC/USDT** — شراء LONG — جودة **94%** ⭐⭐⭐⭐⭐\n🔵 **ETH/USDT** — شراء LONG — جودة **87%** ⭐⭐⭐⭐\n🔵 **SOL/USDT** — شراء LONG — جودة **81%** ⭐⭐⭐⭐` :
           filter === 'forex' ? `🟢 **EUR/USD** — بيع SHORT — جودة **82%** ⭐⭐⭐⭐\n🟢 **GBP/USD** — بيع SHORT — جودة **79%** ⭐⭐⭐⭐\n🟢 **USD/JPY** — شراء LONG — جودة **76%** ⭐⭐⭐` :
           filter === 'stocks' ? `🟡 **AAPL** — شراء سوينج — جودة **88%** ⭐⭐⭐⭐\n🟡 **NVDA** — شراء — جودة **85%** ⭐⭐⭐⭐\n🟡 **MSFT** — شراء — جودة **83%** ⭐⭐⭐⭐` :
           filter === 'gold' ? `🟤 **XAU/USD** — شراء LONG — جودة **91%** ⭐⭐⭐⭐⭐\n🟤 **WTI Oil** — شراء — جودة **78%** ⭐⭐⭐` :
           filter === 'indices' ? `⚪ **S&P 500** — شراء — جودة **77%** ⭐⭐⭐\n⚪ **NASDAQ** — شراء — جودة **75%** ⭐⭐⭐` :
           `جميع الإشارات النشطة اليوم: **7 إشارات**`}

الإجمالي: نجاح **71.4%** اليوم`,
          buttons: [
            [{ label: '🔵 كريبتو', action: 'filter_signals:crypto' }, { label: '🟢 فوركس', action: 'filter_signals:forex' }, { label: '🟡 أسهم', action: 'filter_signals:stocks' }],
            [{ label: '🟤 ذهب', action: 'filter_signals:gold' }, { label: '⚪ مؤشرات', action: 'filter_signals:indices' }, { label: '📋 الكل', action: 'filter_signals:all' }],
            [{ label: '📊 BTC — التفاصيل الكاملة', action: 'goto:signal_btc' }],
            [{ label: '🏠 القائمة الرئيسية', action: 'goto:main_menu' }],
          ],
          timestamp: new Date(),
        }]);
        setActiveMessageId(msgId);
        scrollToBottom();
      }, TYPING_DELAY);
    }
    else if (action === 'copy_referral') {
      navigator.clipboard?.writeText('https://t.me/ApexTradingBot?start=ref_trader_apex');
      addUserMessage('✅ تم نسخ رابط الإحالة!');
    }
    else if (action === 'show_crypto_address') {
      addUserMessage('USDT TRC20 — اضغط للنسخ');
      setTimeout(() => {
        const msgId = `addr-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: msgId,
          type: 'bot',
          text: `💵 **عنوان الدفع USDT TRC20:**

\`TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE\`

• المبلغ: **55.30 USDT**
• الشبكة: **TRON TRC20**
• صالح لمدة: **30 دقيقة** ⏰

⚠️ تحذيرات مهمة:
• أرسل المبلغ الدقيق فقط
• تأكد من اختيار شبكة **TRC20** وليس ERC20
• لا ترسل عملات أخرى على هذا العنوان

🔄 حالة الدفع: في انتظار التأكيد...`,
          buttons: [
            [{ label: '✅ نسخت العنوان — في انتظار التأكيد', action: 'goto:payment_success' }],
            [{ label: '✔️ أرسلت — تحقق يدوياً', action: 'goto:payment_success' }],
            [{ label: '❌ إلغاء', action: 'goto:payment_method' }],
          ],
          timestamp: new Date(),
        }]);
        setActiveMessageId(msgId);
        scrollToBottom();
      }, TYPING_DELAY);
    }
    else if (action === 'quiz_right') {
      setTimeout(() => {
        const msgId = `quiz-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: msgId,
          type: 'bot',
          text: `✅ **إجابة صحيحة! ممتاز!**

المطرقة (Hammer) هي شمعة ذات ظل سفلي طويل جداً وجسم صغير في القمة، وتظهر عند قيعان الاتجاه الهابط كإشارة على احتمال الانعكاس الصعودي.

━━━━━━━━━━━━━━━━━━━━━━━━
**السؤال 2 من 5:**

شمعتان متتاليتان، الأولى حمراء كبيرة والثانية خضراء تغطي جسم الشمعة الحمراء بالكامل. هذا النمط يسمى:`,
          buttons: [
            [{ label: 'A. دوجي', action: 'quiz_wrong' }],
            [{ label: 'B. النجمة الساقطة', action: 'quiz_wrong' }],
            [{ label: 'C. الابتلاع الصعودي ✓', action: 'quiz_right2' }],
            [{ label: 'D. المطرقة', action: 'quiz_wrong' }],
          ],
          timestamp: new Date(),
        }]);
        setActiveMessageId(msgId);
        scrollToBottom();
      }, TYPING_DELAY);
    }
    else if (action === 'quiz_right2') {
      setTimeout(() => {
        const msgId = `quiz2-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: msgId,
          type: 'bot',
          text: `🏆 **نتيجة الاختبار:**

4 من 5 — نسبة **80%** — ممتاز! 🎉

يمكنك الانتقال للدرس التالي.

💡 *ملاحظة: الإجابة التي أخطأت فيها كانت الدوجي — راجع الدرس الخامس للمزيد.*`,
          buttons: [
            [{ label: '⏭️ الدرس التالي', action: 'goto:lesson_content' }],
            [{ label: '🔄 مراجعة إجاباتك', action: 'goto:lesson_content' }],
            [{ label: '📋 قائمة الدروس', action: 'goto:academy_level1' }],
          ],
          timestamp: new Date(),
        }]);
        setActiveMessageId(msgId);
        scrollToBottom();
      }, TYPING_DELAY);
    }
    else if (action === 'quiz_wrong') {
      setTimeout(() => {
        const msgId = `wrong-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: msgId,
          type: 'bot',
          text: `❌ **إجابة خاطئة.**

الإجابة الصحيحة هي: **المطرقة** 🔨

المطرقة (Hammer) هي شمعة ذات ظل سفلي طويل جداً وجسم صغير في القمة، وتظهر عند قيعان الاتجاه الهابط.

لا بأس! المحاولة جزء من التعلم. 💪`,
          buttons: [
            [{ label: '⏭️ السؤال التالي', action: 'quiz_right' }],
            [{ label: '🔙 مراجعة الدرس', action: 'goto:lesson_content' }],
          ],
          timestamp: new Date(),
        }]);
        setActiveMessageId(msgId);
        scrollToBottom();
      }, TYPING_DELAY);
    }
    else {
      // Default: just navigate to main menu or handle unknown
      navigate('main_menu');
    }
  }, [addUserMessage, navigate, userState, scrollToBottom]);

  const handleCommand = useCallback((cmd: string) => {
    addUserMessage(cmd);
    const cmdMap: Record<string, Screen> = {
      '/start': 'welcome',
      '/menu': 'main_menu',
      '/signals': 'signals_live',
      '/analysis': 'morning_report',
      '/portfolio': 'dashboard',
      '/risk': 'risk_center',
      '/calendar': 'economic_calendar',
      '/learn': 'academy',
      '/social': 'social_trading',
      '/subscribe': 'subscription_plans',
      '/settings': 'settings',
      '/language': 'language',
      '/refer': 'referral',
      '/support': 'support',
      '/status': 'status',
      '/calc': 'position_calc',
      '/news': 'news',
      '/connect': 'connect_platforms',
      '/export': 'export_data',
      '/help': 'help',
    };

    if (cmd.startsWith('/')) {
      const screen = cmdMap[cmd.toLowerCase()];
      if (screen) {
        navigate(screen);
      } else {
        // Unknown command
        setTimeout(() => {
          const msgId = `unknown-${Date.now()}`;
          setMessages(prev => [...prev, {
            id: msgId,
            type: 'bot',
            text: `❓ لم أفهم هذا الأمر.

اكتب **/help** لرؤية قائمة جميع الأوامر المتاحة، أو اكتب سؤالك مباشرة وسيرد عليك المساعد الذكي.`,
            buttons: [[{ label: '📖 /help — الأوامر المتاحة', action: 'goto:help' }]],
            timestamp: new Date(),
          }]);
          setActiveMessageId(msgId);
          scrollToBottom();
        }, TYPING_DELAY);
      }
    } else {
      // Treat as AI chat
      setTimeout(() => {
        const msgId = `ai-${Date.now()}`;
        setMessages(prev => [...prev, {
          id: msgId,
          type: 'bot',
          text: `🤖 **المساعد الذكي يرد:**

شكراً على سؤالك. بناءً على تحليلي للأسواق الحالية والمؤشرات الفنية، أنصحك بمراجعة آخر الإشارات المرسلة والتركيز على الأسواق التي تناسب مستواك.

هل تريد توضيحاً إضافياً؟`,
          buttons: [
            [{ label: '💬 نعم، أريد توضيحاً', action: 'goto:ai_assistant' }],
            [{ label: '❓ سؤال آخر', action: 'goto:ai_assistant' }],
            [{ label: '👨‍💼 دعم بشري', action: 'goto:support' }],
          ],
          timestamp: new Date(),
        }]);
        setActiveMessageId(msgId);
        scrollToBottom();
      }, TYPING_DELAY + 400);
    }
  }, [addUserMessage, navigate, scrollToBottom]);

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickCommands = [
    { label: '🏠 رئيسية', action: 'goto:main_menu' },
    { label: '📡 إشارات', action: 'goto:signals_live' },
    { label: '☀️ التحليل', action: 'goto:morning_report' },
    { label: '📊 لوحة التحكم', action: 'goto:dashboard' },
    { label: '🛡️ المخاطر', action: 'goto:risk_center' },
    { label: '💎 الاشتراك', action: 'goto:subscription_plans' },
    { label: '🎓 الأكاديمية', action: 'goto:academy' },
    { label: '🏆 المسابقات', action: 'goto:competitions' },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-tg-chat overflow-hidden">
      {/* Telegram-style chat header */}
      <TelegramHeader onMenuClick={() => setShowSidebar(!showSidebar)} />

      {/* Quick command bar */}
      <div className="flex gap-1 px-3 py-1.5 bg-tg-bg border-b border-tg-divider overflow-x-auto flex-shrink-0 scrollbar-hide">
        {quickCommands.map((qc, i) => (
          <button
            key={i}
            onClick={() => {
              addUserMessage(qc.label);
              handleAction(qc.action, qc.label);
            }}
            className="text-xs text-tg-accentLight bg-tg-button hover:bg-tg-buttonHover px-3 py-1 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
          >
            {qc.label}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto py-3 space-y-1"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(82,136,193,0.04) 0%, transparent 60%),
                           radial-gradient(ellipse at 80% 20%, rgba(82,136,193,0.03) 0%, transparent 60%)`,
        }}
      >
        {/* Date separator */}
        <div className="flex items-center justify-center mb-3">
          <div className="bg-tg-bubble/80 text-tg-subtext text-xs px-3 py-1 rounded-full">
            {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div key={msg.id}>
            <MessageBubble
              type={msg.type}
              text={msg.text}
              timestamp={msg.timestamp}
              isLatest={idx === messages.length - 1 && !isTyping}
            />
            {msg.type === 'bot' && msg.buttons && msg.buttons.length > 0 && (
              <InlineKeyboard
                buttons={msg.buttons}
                onButtonClick={handleAction}
                disabled={activeMessageId !== msg.id}
              />
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <CommandBar onCommand={handleCommand} />

      {/* Sidebar overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="bg-tg-bg w-72 h-full shadow-2xl p-5 flex flex-col gap-4"
            onClick={e => e.stopPropagation()}
          >
            {/* User info */}
            <div className="flex items-center gap-3 pb-4 border-b border-tg-divider">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tg-accent to-blue-700 flex items-center justify-center text-white text-lg font-bold">
                ⚡
              </div>
              <div>
                <p className="text-tg-text font-semibold">APEX Trading Bot</p>
                <p className="text-tg-subtext text-xs">@ApexTradingBot</p>
              </div>
            </div>

            {/* Menu items */}
            <div className="flex flex-col gap-1">
              {[
                { icon: '🏠', label: 'القائمة الرئيسية', screen: 'main_menu' as Screen },
                { icon: '📡', label: 'الإشارات الحية', screen: 'signals_live' as Screen },
                { icon: '📊', label: 'لوحة التحكم', screen: 'dashboard' as Screen },
                { icon: '🛡️', label: 'إدارة المخاطر', screen: 'risk_center' as Screen },
                { icon: '🎓', label: 'الأكاديمية', screen: 'academy' as Screen },
                { icon: '👥', label: 'التداول الاجتماعي', screen: 'social_trading' as Screen },
                { icon: '💎', label: 'خطط الاشتراك', screen: 'subscription_plans' as Screen },
                { icon: '⚙️', label: 'الإعدادات', screen: 'settings' as Screen },
                { icon: '🎁', label: 'برنامج الإحالة', screen: 'referral' as Screen },
                { icon: '🆘', label: 'الدعم الفني', screen: 'support' as Screen },
              ].map(item => (
                <button
                  key={item.screen}
                  onClick={() => { setShowSidebar(false); navigate(item.screen); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-tg-bubble transition-colors text-right"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-tg-text text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Version */}
            <div className="mt-auto pt-4 border-t border-tg-divider">
              <p className="text-tg-subtext text-xs text-center">APEX Trading Bot v2.0</p>
              <p className="text-tg-subtext text-xs text-center">© 2025 APEX Trading</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
