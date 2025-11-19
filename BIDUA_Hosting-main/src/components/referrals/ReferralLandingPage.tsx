import { useState } from 'react';
import { 
  CheckCircle, DollarSign, TrendingUp, Users, Zap, 
  ShoppingCart, CreditCard, Gift, Calculator, Target, 
  Rocket, Star, Heart, Share2, Globe, Clock, ChevronDown, ChevronUp
} from 'lucide-react';

interface ReferralLandingPageProps {
  onSubscribe: () => void;
  onBuyServer: () => void;
}

export function ReferralLandingPage({ onSubscribe, onBuyServer }: ReferralLandingPageProps) {
  const [selectedReferrals, setSelectedReferrals] = useState(10);
  const [avgServerPrice, setAvgServerPrice] = useState(2000);
  const [showFAQ, setShowFAQ] = useState<number | null>(null);

  // Calculate earnings based on multi-level structure
  const calculateEarnings = (referrals: number, avgPrice: number) => {
    const l1 = referrals;
    const l2 = Math.floor(referrals * 0.5); // Assume each L1 brings 0.5 L2
    const l3 = Math.floor(l2 * 0.5); // Each L2 brings 0.5 L3
    
    const l1Commission = l1 * avgPrice * 0.15; // 15% on direct
    const l2Commission = l2 * avgPrice * 0.05; // 5% on level 2
    const l3Commission = l3 * avgPrice * 0.02; // 2% on level 3
    
    const total = l1Commission + l2Commission + l3Commission;
    const yearlyRenewal = total * 12; // If all renew monthly
    
    return {
      l1Referrals: l1,
      l2Referrals: l2,
      l3Referrals: l3,
      l1Earnings: l1Commission,
      l2Earnings: l2Commission,
      l3Earnings: l3Commission,
      totalFirstMonth: total,
      yearlyRecurring: yearlyRenewal
    };
  };

  const earnings = calculateEarnings(selectedReferrals, avgServerPrice);

  const faqs = [
    {
      q: "How does the 3-level commission system work?",
      a: "You earn from 3 levels: Level 1 (your direct referrals) earns you up to 15%, Level 2 (people your referrals bring) earns you 5%, and Level 3 (their referrals) earns you 2%. This creates exponential earning potential as your network grows!"
    },
    {
      q: "Can I really make my server completely free?",
      a: "Absolutely! If your server costs ₹2,000/month and you refer just 2-3 customers who purchase similar servers, your commissions will cover your entire monthly bill. Any additional referrals become pure profit!"
    },
    {
      q: "How do I get started?",
      a: "You have two options: (1) Buy any server and get FREE lifetime affiliate access, or (2) Pay a one-time ₹499 fee for lifetime access. Once activated, you'll get your unique referral code instantly."
    },
    {
      q: "When do I receive my commissions?",
      a: "Commissions are credited once the referred customer's payment is confirmed. You can request payouts once you reach the minimum balance of ₹500. Payouts are processed within 7-10 business days."
    },
    {
      q: "Is there a limit to how much I can earn?",
      a: "No limits! Your earning potential is unlimited. The more you refer, the more you earn. Plus, you continue earning on every renewal - creating true passive income."
    },
    {
      q: "Do I need to be a technical expert to promote?",
      a: "Not at all! We provide ready-made marketing materials, email templates, social media content, and full support to help you succeed regardless of your technical background."
    }
  ];

  const successStories = [
    {
      name: "Rahul M.",
      role: "Freelance Developer",
      earning: "₹45,000/month",
      story: "I referred my clients and dev community. Now my entire infrastructure is free and I make extra income!",
      referrals: 35,
      avatar: "R"
    },
    {
      name: "Priya S.",
      role: "Digital Marketer",
      earning: "₹28,000/month",
      story: "Started with my agency clients. The recurring commissions are amazing - passive income every month!",
      referrals: 22,
      avatar: "P"
    },
    {
      name: "Amit K.",
      role: "Tech Blogger",
      earning: "₹62,000/month",
      story: "Shared with my blog audience. Level 2 and 3 commissions are game-changers for exponential growth!",
      referrals: 48,
      avatar: "A"
    }
  ];

  const commissionBreakdown = [
    {
      level: "Level 1 (Direct Referrals)",
      rate: "Up to 15%",
      description: "People you directly refer",
      color: "from-cyan-600 to-blue-600",
      example: "Refer 10 customers at ₹2,000 = ₹3,000/month"
    },
    {
      level: "Level 2 (Sub-Referrals)",
      rate: "5%",
      description: "People your referrals bring in",
      color: "from-blue-600 to-purple-600",
      example: "5 L2 customers at ₹2,000 = ₹500/month"
    },
    {
      level: "Level 3 (Sub-Sub-Referrals)",
      rate: "2%",
      description: "Third level of your network",
      color: "from-purple-600 to-pink-600",
      example: "3 L3 customers at ₹2,000 = ₹120/month"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full px-4 sm:px-6 py-2 mb-6">
            <Rocket className="h-5 w-5 text-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-semibold text-sm sm:text-base">Transform Your Life with Unlimited Earning Potential</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Turn Your Network Into
            <br />Passive Income Machine
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed">
            Join our <span className="text-cyan-400 font-bold">3-Level Affiliate Program</span> and earn unlimited commissions. 
            Get your servers <span className="text-green-400 font-bold">100% FREE</span> or create a 
            <span className="text-purple-400 font-bold"> life-changing passive income stream</span>!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={onBuyServer}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl font-bold text-base sm:text-lg hover:from-cyan-500 hover:to-teal-500 transition-all shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transform hover:scale-105 w-full sm:w-auto"
            >
              <ShoppingCart className="inline h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              Buy Server - Get FREE Access
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                Most Popular!
              </div>
            </button>
            
            <button
              onClick={onSubscribe}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-base sm:text-lg hover:from-green-500 hover:to-emerald-500 transition-all shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transform hover:scale-105 w-full sm:w-auto"
            >
              <CreditCard className="inline h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              Direct Subscribe - ₹499 Lifetime
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              <span>No Monthly Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              <span>Lifetime Access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              <span>3-Level Commissions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              <span>Unlimited Earnings</span>
            </div>
          </div>
        </div>

        {/* Life-Changing Calculator */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-cyan-500/30 mb-12 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full px-4 py-2 mb-4">
              <Calculator className="h-5 w-5 text-cyan-400" />
              <span className="text-cyan-300 font-semibold">Income Calculator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">See How This Can Change Your Life</h2>
            <p className="text-slate-300 text-sm sm:text-base">Calculate your potential earnings with our 3-level commission system</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 mb-3 font-semibold text-sm sm:text-base">
                  How many people can you refer? (Level 1)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={selectedReferrals}
                  onChange={(e) => setSelectedReferrals(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between mt-2 text-xs sm:text-sm text-slate-400">
                  <span>1</span>
                  <span className="text-cyan-400 font-bold text-lg sm:text-xl">{selectedReferrals} referrals</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-3 font-semibold text-sm sm:text-base">
                  Average server price per month
                </label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={avgServerPrice}
                  onChange={(e) => setAvgServerPrice(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between mt-2 text-xs sm:text-sm text-slate-400">
                  <span>₹500</span>
                  <span className="text-green-400 font-bold text-lg sm:text-xl">₹{avgServerPrice.toLocaleString()}</span>
                  <span>₹10,000</span>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-slate-300 font-semibold mb-3 text-sm sm:text-base">Network Growth Projection</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Level 1 (Direct):</span>
                    <span className="text-cyan-400 font-bold">{earnings.l1Referrals} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Level 2 (Their referrals):</span>
                    <span className="text-blue-400 font-bold">{earnings.l2Referrals} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Level 3 (3rd level):</span>
                    <span className="text-purple-400 font-bold">{earnings.l3Referrals} people</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700 flex justify-between">
                    <span className="text-white font-semibold">Total Network:</span>
                    <span className="text-green-400 font-bold">{earnings.l1Referrals + earnings.l2Referrals + earnings.l3Referrals} people</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Display */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-xl p-6 border-2 border-cyan-500/50">
                <div className="text-sm text-cyan-300 mb-2">First Month Total</div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                  ₹{earnings.totalFirstMonth.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-slate-300">One-time commissions from all new sign-ups</div>
              </div>

              <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-6 border-2 border-green-500/50">
                <div className="text-sm text-green-300 mb-2">Yearly Recurring Income</div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                  ₹{earnings.yearlyRecurring.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-slate-300">If everyone renews monthly for 12 months</div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-cyan-500/20 rounded-lg p-3 border border-cyan-500/30">
                  <div className="text-xs text-cyan-300 mb-1">Level 1</div>
                  <div className="text-base sm:text-lg font-bold">₹{earnings.l1Earnings.toLocaleString()}</div>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                  <div className="text-xs text-blue-300 mb-1">Level 2</div>
                  <div className="text-base sm:text-lg font-bold">₹{earnings.l2Earnings.toLocaleString()}</div>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                  <div className="text-xs text-purple-300 mb-1">Level 3</div>
                  <div className="text-base sm:text-lg font-bold">₹{earnings.l3Earnings.toLocaleString()}</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div className="text-xs sm:text-sm">
                    <div className="font-bold text-yellow-300 mb-1">Make Your Server FREE!</div>
                    <div className="text-slate-300">
                      With just <span className="text-yellow-400 font-bold">{Math.ceil(2000 / (avgServerPrice * 0.15))}</span> referrals at ₹{avgServerPrice}, 
                      you can cover a ₹2,000/month server completely!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-xs sm:text-sm text-slate-400">
            <Heart className="inline h-4 w-4 text-red-400 mr-1" />
            These are conservative estimates. Actual earnings may be higher with renewals and upsells!
          </div>
        </div>

        {/* Commission Breakdown */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">3-Level Commission Structure</h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto">
              Earn from multiple levels of referrals. The deeper your network, the more you earn - automatically!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {commissionBreakdown.map((level, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${level.color} rounded-xl p-6 border-2 border-white/20 transform hover:scale-105 transition-all`}>
                <div className="text-center mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl sm:text-2xl font-bold">{idx + 1}</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">{level.level}</h3>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{level.rate}</div>
                </div>
                <p className="text-white/90 text-xs sm:text-sm mb-3 text-center">{level.description}</p>
                <div className="bg-black/20 rounded-lg p-3 text-center">
                  <div className="text-xs text-white/80 mb-1">Example:</div>
                  <div className="text-sm font-semibold">{level.example}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Real Success Stories</h2>
            <p className="text-slate-300 text-sm sm:text-base">See how our affiliates are transforming their income</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {successStories.map((story, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/30 hover:border-cyan-500/60 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold flex-shrink-0">
                    {story.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-white truncate">{story.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-400">{story.role}</p>
                  </div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
                  <div className="text-xs text-green-300 mb-1">Monthly Earnings</div>
                  <div className="text-xl sm:text-2xl font-bold text-green-400">{story.earning}</div>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm italic mb-3">"{story.story}"</p>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">Referrals:</span>
                  <span className="text-cyan-400 font-bold">{story.referrals} customers</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">What You Get</h2>
            <p className="text-slate-300 text-sm sm:text-base">Everything you need to succeed in our affiliate program</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Gift, title: "Lifetime Access", desc: "One-time payment, earn forever. No recurring fees ever!" },
              { icon: TrendingUp, title: "3-Level Commissions", desc: "Earn from your network and their networks too" },
              { icon: DollarSign, title: "Recurring Income", desc: "Get paid every time your referrals renew" },
              { icon: Users, title: "Track Everything", desc: "Real-time dashboard to monitor all earnings & team" },
              { icon: Zap, title: "Instant Activation", desc: "Start earning immediately after joining" },
              { icon: Target, title: "Marketing Support", desc: "Ready-made banners, templates & promotional materials" },
              { icon: Globe, title: "No Limits", desc: "Unlimited referrals, unlimited earning potential" },
              { icon: Clock, title: "Fast Payouts", desc: "Request payout anytime, processed within 7-10 days" },
              { icon: Share2, title: "Easy Sharing", desc: "Unique referral link that works everywhere" }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all">
                <benefit.icon className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-400 mb-4" />
                <h3 className="font-bold text-base sm:text-lg mb-2">{benefit.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-cyan-500/30 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Flexible Payout Options</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[
              { method: "Bank Transfer", min: "₹500", time: "7-10 days", icon: "🏦" },
              { method: "UPI", min: "₹500", time: "Instant", icon: "📱" },
              { method: "Account Credit", min: "Any amount", time: "Instant", icon: "💳" },
              { method: "PayPal", min: "$10", time: "1-3 days", icon: "💰" }
            ].map((method, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="text-3xl mb-3 text-center">{method.icon}</div>
                <h3 className="font-bold text-center mb-3 text-sm sm:text-base">{method.method}</h3>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Minimum:</span>
                    <span className="text-white font-semibold">{method.min}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Processing:</span>
                    <span className="text-green-400 font-semibold">{method.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-4 text-center text-xs sm:text-sm">
            <strong className="text-cyan-300">Tax Information:</strong> TDS (10%) and GST (18%) applicable as per Indian tax regulations. 
            Net payout = Gross amount × 0.72
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-300 text-sm sm:text-base">Everything you need to know to get started</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                <button
                  onClick={() => setShowFAQ(showFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-all"
                >
                  <span className="font-semibold text-sm sm:text-base pr-4">{faq.q}</span>
                  {showFAQ === idx ? (
                    <ChevronUp className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {showFAQ === idx && (
                  <div className="px-6 pb-4 text-slate-300 text-xs sm:text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center border-2 border-white/20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Ready to Transform Your Income?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-cyan-100 max-w-3xl mx-auto">
            Join thousands of successful affiliates earning passive income. Start your journey today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <button
              onClick={onBuyServer}
              className="px-8 py-4 bg-white text-cyan-600 rounded-xl font-bold text-lg hover:bg-cyan-50 transition-all shadow-xl transform hover:scale-105 w-full sm:w-auto"
            >
              <ShoppingCart className="inline h-6 w-6 mr-2" />
              Buy Server - Get FREE Access
            </button>
            
            <button
              onClick={onSubscribe}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-lg hover:from-green-500 hover:to-emerald-500 transition-all shadow-xl transform hover:scale-105 w-full sm:w-auto"
            >
              <CreditCard className="inline h-6 w-6 mr-2" />
              Subscribe Now - ₹499
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-cyan-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Lifetime Access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>No Recurring Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Start Earning Today</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
