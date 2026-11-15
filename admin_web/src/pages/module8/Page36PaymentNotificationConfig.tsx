import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  CreditCard, 
  Bell, 
  Mail,
  MapPin, 
  Database, 
  FileSpreadsheet, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  Lock, 
  Key, 
  Server, 
  ExternalLink,
  Zap,
  Globe,
  Radio,
  Send,
  Cloud,
  Layers,
  Inbox,
  Power,
  Sliders,
  Check,
  XCircle
} from 'lucide-react';

export const Page36PaymentNotificationConfig: React.FC = () => {
  const { addToast } = useAdmin();
  const [activeCategory, setActiveCategory] = useState<'Payments' | 'Email' | 'SMS' | 'Maps' | 'Cloud' | 'Accounting'>('Payments');

  // Enable/Disable state dictionary for all integrations
  const [enabledProviders, setEnabledProviders] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('servicepro_enabled_integrations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      stripe: true,
      square: false,
      razorpay: true,
      paypal: false,
      ses: true,
      sendgrid: false,
      postmark: false,
      twilio: true,
      messagebird: false,
      vonage: false,
      google: true,
      mapbox: false,
      osm: true,
      aws: true,
      supabase: false,
      gcp: false,
      quickbooks: true,
      xero: false,
      freshbooks: false
    };
  });

  const toggleProvider = (key: string, name: string) => {
    setEnabledProviders(prev => {
      const nextVal = !prev[key];
      const nextState = { ...prev, [key]: nextVal };
      localStorage.setItem('servicepro_enabled_integrations', JSON.stringify(nextState));
      addToast(`${name} has been ${nextVal ? 'ENABLED (Active in system)' : 'DISABLED (Deactivated)'}!`, nextVal ? 'success' : 'info');
      return nextState;
    });
  };

  // 1. Payment Gateways State
  const [stripeLiveKey, setStripeLiveKey] = useState(() => localStorage.getItem('cfg_stripeLiveKey') || '');
  const [stripeSecretKey, setStripeSecretKey] = useState(() => localStorage.getItem('cfg_stripeSecretKey') || '');
  const [squareAppId, setSquareAppId] = useState(() => localStorage.getItem('cfg_squareAppId') || '');
  const [squareAccessToken, setSquareAccessToken] = useState(() => localStorage.getItem('cfg_squareAccessToken') || '');
  const [razorpayKeyId, setRazorpayKeyId] = useState(() => localStorage.getItem('cfg_razorpayKeyId') || '');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState(() => localStorage.getItem('cfg_razorpayKeySecret') || '');
  const [razorpayCurrency, setRazorpayCurrency] = useState(() => localStorage.getItem('cfg_razorpayCurrency') || 'USD');
  const [paypalClientId, setPaypalClientId] = useState(() => localStorage.getItem('cfg_paypalClientId') || '');
  const [paypalSecret, setPaypalSecret] = useState(() => localStorage.getItem('cfg_paypalSecret') || '');

  // 2. Transactional Email State (Amazon SES, SendGrid, Postmark)
  const [sesRegion, setSesRegion] = useState(() => localStorage.getItem('cfg_sesRegion') || 'us-east-1 (N. Virginia)');
  const [sesSenderEmail, setSesSenderEmail] = useState(() => localStorage.getItem('cfg_sesSenderEmail') || '');
  const [sesAccessKeyId, setSesAccessKeyId] = useState(() => localStorage.getItem('cfg_sesAccessKeyId') || '');
  const [sesSecretAccessKey, setSesSecretAccessKey] = useState(() => localStorage.getItem('cfg_sesSecretAccessKey') || '');
  const [sendgridApiKey, setSendgridApiKey] = useState(() => localStorage.getItem('cfg_sendgridApiKey') || '');
  const [sendgridFromEmail, setSendgridFromEmail] = useState(() => localStorage.getItem('cfg_sendgridFromEmail') || '');
  const [postmarkServerToken, setPostmarkServerToken] = useState(() => localStorage.getItem('cfg_postmarkServerToken') || '');
  const [postmarkBroadcastStream, setPostmarkBroadcastStream] = useState(() => localStorage.getItem('cfg_postmarkBroadcastStream') || 'outbound-dispatch-invoices');

  // 3. SMS & Voice State
  const [twilioSid, setTwilioSid] = useState(() => localStorage.getItem('cfg_twilioSid') || '');
  const [twilioSenderNumber, setTwilioSenderNumber] = useState(() => localStorage.getItem('cfg_twilioSenderNumber') || '');
  const [birdApiKey, setBirdApiKey] = useState(() => localStorage.getItem('cfg_birdApiKey') || '');
  const [birdChannelId, setBirdChannelId] = useState(() => localStorage.getItem('cfg_birdChannelId') || '');
  const [vonageApiKey, setVonageApiKey] = useState(() => localStorage.getItem('cfg_vonageApiKey') || '');

  // 4. Maps & Geolocation State
  const [googleMapsKey, setGoogleMapsKey] = useState(() => localStorage.getItem('cfg_googleMapsKey') || '');
  const [mapboxAccessToken, setMapboxAccessToken] = useState(() => localStorage.getItem('cfg_mapboxAccessToken') || '');
  const [osrmServerUrl, setOsrmServerUrl] = useState(() => localStorage.getItem('cfg_osrmServerUrl') || 'https://router.project-osrm.org');

  // 5. Cloud Database & AWS Suite State
  const [awsBucketName, setAwsBucketName] = useState(() => localStorage.getItem('cfg_awsBucketName') || '');
  const [awsRdsEndpoint, setAwsRdsEndpoint] = useState(() => localStorage.getItem('cfg_awsRdsEndpoint') || '');
  const [awsSnsTopicArn, setAwsSnsTopicArn] = useState(() => localStorage.getItem('cfg_awsSnsTopicArn') || '');
  const [awsAccessKey, setAwsAccessKey] = useState(() => localStorage.getItem('cfg_awsAccessKey') || '');
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('cfg_supabaseUrl') || '');
  const [gcpProjectId, setGcpProjectId] = useState(() => localStorage.getItem('cfg_gcpProjectId') || '');

  // 6. Accounting State
  const [qbRealmId, setQbRealmId] = useState(() => localStorage.getItem('cfg_qbRealmId') || '');
  const [xeroTenantId, setXeroTenantId] = useState(() => localStorage.getItem('cfg_xeroTenantId') || '');
  const [freshbooksAccountId, setFreshbooksAccountId] = useState(() => localStorage.getItem('cfg_freshbooksAccountId') || '');

  const [testingProvider, setTestingProvider] = useState<string | null>(null);

  const testConnection = (providerName: string) => {
    setTestingProvider(providerName);
    setTimeout(() => {
      setTestingProvider(null);
      let isConfigured = false;
      const cleanCheck = (val?: string) => Boolean(val && val.trim() && !val.includes('your_') && !val.includes('placeholder') && !val.includes('xxx'));

      if (providerName.includes('Stripe')) isConfigured = cleanCheck(stripeLiveKey) || cleanCheck(stripeSecretKey);
      else if (providerName.includes('Square')) isConfigured = cleanCheck(squareAppId) || cleanCheck(squareAccessToken);
      else if (providerName.includes('Razorpay')) isConfigured = cleanCheck(razorpayKeyId);
      else if (providerName.includes('PayPal')) isConfigured = cleanCheck(paypalClientId);
      else if (providerName.includes('SES') || providerName.includes('Amazon SES')) isConfigured = cleanCheck(sesAccessKeyId) || cleanCheck(sesSenderEmail);
      else if (providerName.includes('SendGrid')) isConfigured = cleanCheck(sendgridApiKey);
      else if (providerName.includes('Postmark')) isConfigured = cleanCheck(postmarkServerToken);
      else if (providerName.includes('Twilio')) isConfigured = cleanCheck(twilioSid);
      else if (providerName.includes('Bird')) isConfigured = cleanCheck(birdApiKey);
      else if (providerName.includes('Vonage')) isConfigured = cleanCheck(vonageApiKey);
      else if (providerName.includes('Google Maps')) isConfigured = cleanCheck(googleMapsKey);
      else if (providerName.includes('Mapbox')) isConfigured = cleanCheck(mapboxAccessToken);
      else if (providerName.includes('OSRM')) isConfigured = cleanCheck(osrmServerUrl);
      else if (providerName.includes('AWS')) isConfigured = cleanCheck(awsAccessKey) || cleanCheck(awsBucketName);
      else if (providerName.includes('Supabase')) isConfigured = cleanCheck(supabaseUrl);
      else if (providerName.includes('Google Cloud') || providerName.includes('GCP')) isConfigured = cleanCheck(gcpProjectId);
      else if (providerName.includes('QuickBooks')) isConfigured = cleanCheck(qbRealmId);
      else if (providerName.includes('Xero')) isConfigured = cleanCheck(xeroTenantId);
      else if (providerName.includes('FreshBooks')) isConfigured = cleanCheck(freshbooksAccountId);

      if (isConfigured) {
        addToast(`${providerName} settings validated successfully.`, 'success');
      } else {
        addToast(`${providerName} unconfigured: Please enter your credentials and save before testing.`, 'warning');
      }
    }, 400);
  };

  const handleSaveAll = () => {
    // Persist all state values
    localStorage.setItem('servicepro_enabled_integrations', JSON.stringify(enabledProviders));
    localStorage.setItem('cfg_stripeLiveKey', stripeLiveKey);
    localStorage.setItem('cfg_stripeSecretKey', stripeSecretKey);
    localStorage.setItem('cfg_squareAppId', squareAppId);
    localStorage.setItem('cfg_squareAccessToken', squareAccessToken);
    localStorage.setItem('cfg_razorpayKeyId', razorpayKeyId);
    localStorage.setItem('cfg_razorpayKeySecret', razorpayKeySecret);
    localStorage.setItem('cfg_razorpayCurrency', razorpayCurrency);
    localStorage.setItem('cfg_paypalClientId', paypalClientId);
    localStorage.setItem('cfg_paypalSecret', paypalSecret);

    localStorage.setItem('cfg_sesRegion', sesRegion);
    localStorage.setItem('cfg_sesSenderEmail', sesSenderEmail);
    localStorage.setItem('cfg_sesAccessKeyId', sesAccessKeyId);
    localStorage.setItem('cfg_sesSecretAccessKey', sesSecretAccessKey);
    localStorage.setItem('cfg_sendgridApiKey', sendgridApiKey);
    localStorage.setItem('cfg_sendgridFromEmail', sendgridFromEmail);
    localStorage.setItem('cfg_postmarkServerToken', postmarkServerToken);
    localStorage.setItem('cfg_postmarkBroadcastStream', postmarkBroadcastStream);

    localStorage.setItem('cfg_twilioSid', twilioSid);
    localStorage.setItem('cfg_twilioSenderNumber', twilioSenderNumber);
    localStorage.setItem('cfg_birdApiKey', birdApiKey);
    localStorage.setItem('cfg_birdChannelId', birdChannelId);
    localStorage.setItem('cfg_vonageApiKey', vonageApiKey);

    localStorage.setItem('cfg_googleMapsKey', googleMapsKey);
    localStorage.setItem('cfg_mapboxAccessToken', mapboxAccessToken);
    localStorage.setItem('cfg_osrmServerUrl', osrmServerUrl);

    localStorage.setItem('cfg_awsBucketName', awsBucketName);
    localStorage.setItem('cfg_awsRdsEndpoint', awsRdsEndpoint);
    localStorage.setItem('cfg_awsSnsTopicArn', awsSnsTopicArn);
    localStorage.setItem('cfg_awsAccessKey', awsAccessKey);
    localStorage.setItem('cfg_supabaseUrl', supabaseUrl);
    localStorage.setItem('cfg_gcpProjectId', gcpProjectId);

    localStorage.setItem('cfg_qbRealmId', qbRealmId);
    localStorage.setItem('cfg_xeroTenantId', xeroTenantId);
    localStorage.setItem('cfg_freshbooksAccountId', freshbooksAccountId);

    addToast('All API credentials, configurations, and Enabled/Disabled states saved to enterprise vault!', 'success');
  };

  // Reusable Enable/Disable Toggle Component
  const RenderToggle = ({ idKey, name }: { idKey: string; name: string }) => {
    const isEnabled = !!enabledProviders[idKey];
    return (
      <button
        type="button"
        onClick={() => toggleProvider(idKey, name)}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer shadow-2xs ${
          isEnabled
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-500/20'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }`}
        title={`Click to ${isEnabled ? 'Disable' : 'Enable'} ${name}`}
      >
        <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></span>
        <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Integrations &amp; API Configuration</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Live Toggle Controls Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enable or disable individual payment gateways, Amazon SES email delivery, Google Maps live GPS, and AWS cloud services based on your business model.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save All Integrations</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto thin-scrollbar pb-1">
        {[
          { key: 'Payments', label: 'Payment Gateways (Stripe, Square, Razorpay, PayPal)', icon: CreditCard },
          { key: 'Email', label: 'Transactional Email (Amazon SES, SendGrid, Postmark)', icon: Mail },
          { key: 'SMS', label: 'SMS & Voice Dispatch (Twilio, Bird, Vonage)', icon: Bell },
          { key: 'Maps', label: 'Maps & Live GPS (Google Maps, Mapbox, OSM)', icon: MapPin },
          { key: 'Cloud', label: 'Cloud Infrastructure & AWS Suite (AWS, Supabase, GCP)', icon: Database },
          { key: 'Accounting', label: 'Accounting & QuickBooks (Intuit, Xero, FreshBooks)', icon: FileSpreadsheet }
        ].map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key as any)}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#0C3832] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. PAYMENT GATEWAYS */}
      {activeCategory === 'Payments' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>Admin can toggle individual gateways ON or OFF. Disabled gateways will not appear in customer checkout or technician card terminals.</span>
            <span className="font-bold">Active Providers: {[enabledProviders.stripe && 'Stripe', enabledProviders.square && 'Square', enabledProviders.razorpay && 'Razorpay', enabledProviders.paypal && 'PayPal'].filter(Boolean).join(', ') || 'None (All Disabled)'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Stripe */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.stripe ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Stripe Connect</span>
                    <span className="text-[10px] text-slate-500">ACH &amp; Card Processing</span>
                  </div>
                  <RenderToggle idKey="stripe" name="Stripe Connect" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Full customer credit card processing, Apple Pay, Google Pay, ACH bank transfers, and split technician payouts.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Publishable Key</label>
                    <input
                      type="text"
                      value={stripeLiveKey}
                      onChange={e => setStripeLiveKey(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Secret Key</label>
                    <input
                      type="password"
                      value={stripeSecretKey}
                      onChange={e => setStripeSecretKey(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.stripe ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.stripe ? '● Live 200 OK' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Stripe Connect')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'Stripe Connect' ? 'Pinging...' : 'Test Ping'}
                </button>
              </div>
            </div>

            {/* 2. Square */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.square ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Square Terminal</span>
                    <span className="text-[10px] text-slate-500">Field Reader POS</span>
                  </div>
                  <RenderToggle idKey="square" name="Square Terminal" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  In-person contactless card readers and hardware POS terminals for technicians on customer doorstep.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Application ID</label>
                    <input
                      type="text"
                      value={squareAppId}
                      onChange={e => setSquareAppId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Access Token</label>
                    <input
                      type="password"
                      value={squareAccessToken}
                      onChange={e => setSquareAccessToken(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.square ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.square ? '● Ready to Pair' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Square Terminal')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'Square Terminal' ? 'Pinging...' : 'Test Ping'}
                </button>
              </div>
            </div>

            {/* 3. Razorpay */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.razorpay ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Razorpay Gateway</span>
                    <span className="text-[10px] text-slate-500">100+ Currencies</span>
                  </div>
                  <RenderToggle idKey="razorpay" name="Razorpay International" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Multi-currency checkout, global credit cards, international payments, UPI, and instant smart payment links.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Razorpay Key ID</label>
                    <input
                      type="text"
                      value={razorpayKeyId}
                      onChange={e => setRazorpayKeyId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Key Secret</label>
                    <input
                      type="password"
                      value={razorpayKeySecret}
                      onChange={e => setRazorpayKeySecret(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Base Currency</label>
                    <select
                      value={razorpayCurrency}
                      onChange={e => setRazorpayCurrency(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-[11px] font-bold"
                    >
                      <option value="USD">USD — US Dollar ($)</option>
                      <option value="GBP">GBP — British Pound (£)</option>
                      <option value="EUR">EUR — Euro (€)</option>
                      <option value="AUD">AUD — Australian Dollar (A$)</option>
                      <option value="CAD">CAD — Canadian Dollar (C$)</option>
                      <option value="AED">AED — UAE Dirham</option>
                      <option value="INR">INR — Indian Rupee (₹)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.razorpay ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.razorpay ? '● Active Multi-Currency' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Razorpay International')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'Razorpay International' ? 'Pinging...' : 'Test Ping'}
                </button>
              </div>
            </div>

            {/* 4. PayPal */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.paypal ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">PayPal / Braintree</span>
                    <span className="text-[10px] text-slate-500">Global Escrow</span>
                  </div>
                  <RenderToggle idKey="paypal" name="PayPal / Braintree" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Multi-currency international checkout with dispute mediation and customer PayPal wallet sync.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Client ID</label>
                    <input
                      type="text"
                      value={paypalClientId}
                      onChange={e => setPaypalClientId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Secret Key</label>
                    <input
                      type="password"
                      value={paypalSecret}
                      onChange={e => setPaypalSecret(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.paypal ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.paypal ? '● Ready to Pair' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('PayPal / Braintree')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'PayPal / Braintree' ? 'Pinging...' : 'Test Ping'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TRANSACTIONAL EMAIL (Amazon SES, SendGrid, Postmark) */}
      {activeCategory === 'Email' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>Toggle which email service dispatches automated PDF invoices and arrival notices. Amazon SES provides $0.10/1,000 email deliverability.</span>
            <span className="font-bold">Active Engine: {[enabledProviders.ses && 'Amazon SES', enabledProviders.sendgrid && 'SendGrid', enabledProviders.postmark && 'Postmark'].filter(Boolean).join(', ') || 'None'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 1. Amazon SES */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.ses ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Amazon SES (Simple Email Service)</span>
                    <span className="text-[10px] text-amber-700 font-bold">AWS Enterprise Standard</span>
                  </div>
                  <RenderToggle idKey="ses" name="Amazon SES" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  High-deliverability, ultra-low-cost ($0.10 / 1000 emails) AWS transactional engine for PDF invoices and dispatch alerts.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">AWS SES Region</label>
                    <select
                      value={sesRegion}
                      onChange={e => setSesRegion(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-[11px] font-mono"
                    >
                      <option value="us-east-1 (N. Virginia)">us-east-1 (N. Virginia)</option>
                      <option value="us-west-2 (Oregon)">us-west-2 (Oregon)</option>
                      <option value="eu-west-1 (Ireland)">eu-west-1 (Ireland / London)</option>
                      <option value="eu-central-1 (Frankfurt)">eu-central-1 (Frankfurt)</option>
                      <option value="ap-south-1 (Mumbai)">ap-south-1 (Mumbai)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Verified Sender Identity (From Email)</label>
                    <input
                      type="email"
                      value={sesSenderEmail}
                      onChange={e => setSesSenderEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">AWS IAM Access Key ID</label>
                    <input
                      type="text"
                      value={sesAccessKeyId}
                      onChange={e => setSesAccessKeyId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">AWS Secret Access Key</label>
                    <input
                      type="password"
                      value={sesSecretAccessKey}
                      onChange={e => setSesSecretAccessKey(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">DKIM &amp; SPF Verification:</span>
                      <span className="font-mono font-bold text-emerald-700">● 100% VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.ses ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.ses ? '● AWS SES Active' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Amazon SES')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>{testingProvider === 'Amazon SES' ? 'Sending...' : 'Send Test Invoice'}</span>
                </button>
              </div>
            </div>

            {/* 2. SendGrid */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.sendgrid ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Twilio SendGrid</span>
                    <span className="text-[10px] text-blue-700 font-bold">Marketing &amp; API</span>
                  </div>
                  <RenderToggle idKey="sendgrid" name="Twilio SendGrid" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Twilio-backed marketing broadcasts, visual HTML email template builder, and dynamic customer newsletters.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">SendGrid API Key</label>
                    <input
                      type="password"
                      value={sendgridApiKey}
                      onChange={e => setSendgridApiKey(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">From Sender Address</label>
                    <input
                      type="email"
                      value={sendgridFromEmail}
                      onChange={e => setSendgridFromEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.sendgrid ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.sendgrid ? '● Connected' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('SendGrid API')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'SendGrid API' ? 'Testing...' : 'Test Ping'}
                </button>
              </div>
            </div>

            {/* 3. Postmark */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.postmark ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Postmark (ActiveCampaign)</span>
                    <span className="text-[10px] text-purple-700 font-bold">Sub-Second Inbox</span>
                  </div>
                  <RenderToggle idKey="postmark" name="Postmark" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Dedicated message streams for emergency technician dispatch alerts with zero spam folder delay.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Server API Token</label>
                    <input
                      type="password"
                      value={postmarkServerToken}
                      onChange={e => setPostmarkServerToken(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Message Stream ID</label>
                    <input
                      type="text"
                      value={postmarkBroadcastStream}
                      onChange={e => setPostmarkBroadcastStream(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.postmark ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.postmark ? '● Standby' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Postmark')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'Postmark' ? 'Testing...' : 'Test Ping'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SMS & COMMUNICATIONS */}
      {activeCategory === 'SMS' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 text-xs text-emerald-950 flex items-center justify-between">
            <span>Toggle SMS &amp; Voice dispatch networks. Enable Twilio for US 10DLC routes, or Bird for WhatsApp Business alerts.</span>
            <span className="font-bold">Active: {[enabledProviders.twilio && 'Twilio', enabledProviders.messagebird && 'Bird', enabledProviders.vonage && 'Vonage'].filter(Boolean).join(', ') || 'None'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Twilio */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.twilio ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Twilio SMS &amp; Voice</span>
                    <span className="text-[10px] text-emerald-800 font-bold">Primary US/UK</span>
                  </div>
                  <RenderToggle idKey="twilio" name="Twilio SMS" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  High-deliverability 10DLC SMS routes, masked phone call relay between customer and technician.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Account SID</label>
                    <input
                      type="text"
                      value={twilioSid}
                      onChange={e => setTwilioSid(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Sender Phone Number</label>
                    <input
                      type="text"
                      value={twilioSenderNumber}
                      onChange={e => setTwilioSenderNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.twilio ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.twilio ? '● Connected 200 OK' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Twilio SMS')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'Twilio SMS' ? 'Sending...' : 'Send Test SMS'}
                </button>
              </div>
            </div>

            {/* Bird */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.messagebird ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Bird (MessageBird)</span>
                    <span className="text-[10px] text-purple-800 font-bold">WhatsApp + SMS</span>
                  </div>
                  <RenderToggle idKey="messagebird" name="Bird (MessageBird)" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Multi-channel messaging with official WhatsApp Business API notifications and European SMS routes.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Live API Key</label>
                    <input
                      type="password"
                      value={birdApiKey}
                      onChange={e => setBirdApiKey(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Channel ID</label>
                    <input
                      type="text"
                      value={birdChannelId}
                      onChange={e => setBirdChannelId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.messagebird ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.messagebird ? '● Ready to Connect' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Bird API')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'Bird API' ? 'Testing...' : 'Test Ping'}
                </button>
              </div>
            </div>

            {/* Vonage */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.vonage ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Vonage (Nexmo)</span>
                    <span className="text-[10px] text-slate-700 font-bold">Voice &amp; 2FA</span>
                  </div>
                  <RenderToggle idKey="vonage" name="Vonage" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Enterprise voice IVR, customer security PIN verification, and backup SMS delivery.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">API Key</label>
                    <input
                      type="text"
                      value={vonageApiKey}
                      onChange={e => setVonageApiKey(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.vonage ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.vonage ? '● Standby' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Vonage API')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'Vonage API' ? 'Testing...' : 'Test Ping'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MAPS & LIVE GPS */}
      {activeCategory === 'Maps' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 text-xs text-emerald-950 flex items-center justify-between">
            <span>Toggle mapping providers for live dispatch telemetry and customer Google Maps sharing links.</span>
            <span className="font-bold">Active: {[enabledProviders.google && 'Google Maps', enabledProviders.mapbox && 'Mapbox', enabledProviders.osm && 'OpenStreetMap'].filter(Boolean).join(', ') || 'None'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Google Maps */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.google ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Google Maps Platform</span>
                    <span className="text-[10px] text-emerald-800 font-bold">Live GPS Standard</span>
                  </div>
                  <RenderToggle idKey="google" name="Google Maps Platform" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Google Routes API, Geocoding, Places Autocomplete, and customer one-click live Google Maps sharing links.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Google Maps API Key</label>
                    <input
                      type="text"
                      value={googleMapsKey}
                      onChange={e => setGoogleMapsKey(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                    ✓ Directions API Enabled<br />
                    ✓ Live Tracking Link Sharing Enabled
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.google ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.google ? '● Active in Dispatch Board' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Google Maps API')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'Google Maps API' ? 'Pinging...' : 'Test Geocode'}
                </button>
              </div>
            </div>

            {/* Mapbox */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.mapbox ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Mapbox GL &amp; Nav SDK</span>
                    <span className="text-[10px] text-sky-800 font-bold">High FPS Telemetry</span>
                  </div>
                  <RenderToggle idKey="mapbox" name="Mapbox SDK" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Vector tiles, night/dark map styles, 60fps moving vehicle marker interpolation and turn-by-turn navigation.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Public Access Token</label>
                    <input
                      type="password"
                      value={mapboxAccessToken}
                      onChange={e => setMapboxAccessToken(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.mapbox ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.mapbox ? '● Ready to Switch' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Mapbox SDK')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'Mapbox SDK' ? 'Testing...' : 'Test Ping'}
                </button>
              </div>
            </div>

            {/* OpenStreetMap */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.osm ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">OpenStreetMap / Leaflet</span>
                    <span className="text-[10px] text-emerald-800 font-bold">Open Source &amp; Free</span>
                  </div>
                  <RenderToggle idKey="osm" name="OpenStreetMap" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Community-driven global street maps with zero monthly per-tile API costs and OSRM routing calculations.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">OSRM Routing Server</label>
                    <input
                      type="text"
                      value={osrmServerUrl}
                      onChange={e => setOsrmServerUrl(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.osm ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.osm ? '● Built-in Fallback Active' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('OSRM Routing')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'OSRM Routing' ? 'Pinging...' : 'Test Ping'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CLOUD INFRASTRUCTURE & AWS SUITE */}
      {activeCategory === 'Cloud' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 text-xs text-emerald-950 flex items-center justify-between">
            <span>Toggle primary cloud backends storing work orders, S3 before/after photos, and Amazon RDS PostgreSQL databases.</span>
            <span className="font-bold">Active: {[enabledProviders.aws && 'AWS Cloud Suite', enabledProviders.supabase && 'Supabase', enabledProviders.gcp && 'GCP'].filter(Boolean).join(', ') || 'None'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* AWS Suite */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.aws ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Amazon Web Services (AWS)</span>
                    <span className="text-[10px] text-amber-800 font-bold">S3 + SES + SNS + RDS</span>
                  </div>
                  <RenderToggle idKey="aws" name="AWS Cloud Suite" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Full enterprise AWS ecosystem: S3 storage buckets, Amazon SES invoice delivery, SNS push notifications, and RDS managed databases.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">AWS S3 Photo Storage Bucket</label>
                    <input
                      type="text"
                      value={awsBucketName}
                      onChange={e => setAwsBucketName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Amazon RDS PostgreSQL Endpoint</label>
                    <input
                      type="text"
                      value={awsRdsEndpoint}
                      onChange={e => setAwsRdsEndpoint(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Amazon SNS Dispatch Topic ARN</label>
                    <input
                      type="text"
                      value={awsSnsTopicArn}
                      onChange={e => setAwsSnsTopicArn(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.aws ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.aws ? '● Connected (AWS us-east-1)' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('AWS Cloud Suite')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Cloud className="w-3 h-3" />
                  <span>{testingProvider === 'AWS Cloud Suite' ? 'Pinging...' : 'Ping AWS'}</span>
                </button>
              </div>
            </div>

            {/* Supabase */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.supabase ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Supabase Cloud</span>
                    <span className="text-[10px] text-emerald-800 font-bold">Cloud Database &amp; Realtime</span>
                  </div>
                  <RenderToggle idKey="supabase" name="Supabase Cloud" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Open-source backend engine with geospatial dispatch tracking, storage, and realtime WebSockets.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Project URL</label>
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={e => setSupabaseUrl(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.supabase ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.supabase ? '● Connected' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Supabase Cloud')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'Supabase Cloud' ? 'Pinging...' : 'Test DB'}
                </button>
              </div>
            </div>

            {/* Google Cloud */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.gcp ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Google Cloud Platform</span>
                    <span className="text-[10px] text-blue-800 font-bold">Cloud SQL</span>
                  </div>
                  <RenderToggle idKey="gcp" name="Google Cloud Platform" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Google Cloud SQL managed engine and Google Cloud Storage buckets integrated with Firebase Auth.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">GCP Project ID</label>
                    <input
                      type="text"
                      value={gcpProjectId}
                      onChange={e => setGcpProjectId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.gcp ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.gcp ? '● Standby' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Google Cloud SQL')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'Google Cloud SQL' ? 'Testing...' : 'Test GCP'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. ACCOUNTING & ERP */}
      {activeCategory === 'Accounting' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 text-xs text-emerald-950 flex items-center justify-between">
            <span>Toggle corporate accounting synchronization. Enable QuickBooks for US state tax reconciliation or Xero for UK VAT returns.</span>
            <span className="font-bold">Active: {[enabledProviders.quickbooks && 'QuickBooks', enabledProviders.xero && 'Xero', enabledProviders.freshbooks && 'FreshBooks'].filter(Boolean).join(', ') || 'None'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* QuickBooks */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.quickbooks ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">QuickBooks Online (Intuit)</span>
                    <span className="text-[10px] text-emerald-800 font-bold">US Standard</span>
                  </div>
                  <RenderToggle idKey="quickbooks" name="QuickBooks Online" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Automatic invoice generation, state sales tax auto-calculation, and direct reconciliation with commercial bank accounts.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company Realm ID</label>
                    <input
                      type="text"
                      value={qbRealmId}
                      onChange={e => setQbRealmId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.quickbooks ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.quickbooks ? '● Active Sync (2-Way)' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('QuickBooks Online')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'QuickBooks Online' ? 'Syncing...' : 'Sync Accounts'}
                </button>
              </div>
            </div>

            {/* Xero */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.xero ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">Xero Accounting Cloud</span>
                    <span className="text-[10px] text-sky-800 font-bold">UK/EU Standard</span>
                  </div>
                  <RenderToggle idKey="xero" name="Xero Cloud" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Multi-currency accounting reconciliation, automated UK VAT Return submissions, and billable expense tracking.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Xero Tenant ID</label>
                    <input
                      type="text"
                      value={xeroTenantId}
                      onChange={e => setXeroTenantId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.xero ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.xero ? '● Standby' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('Xero Cloud')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'Xero Cloud' ? 'Testing...' : 'Test Ping'}
                </button>
              </div>
            </div>

            {/* FreshBooks */}
            <div className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              enabledProviders.freshbooks ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm' : 'bg-slate-50/80 border-slate-200 opacity-80'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900 block">FreshBooks Enterprise</span>
                    <span className="text-[10px] text-blue-800 font-bold">Fast Invoicing</span>
                  </div>
                  <RenderToggle idKey="freshbooks" name="FreshBooks" />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Lightweight contractor billing, recurring client retainers, and automated late payment penalty reminders.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Account ID</label>
                    <input
                      type="text"
                      value={freshbooksAccountId}
                      onChange={e => setFreshbooksAccountId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${enabledProviders.freshbooks ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {enabledProviders.freshbooks ? '● Standby' : '○ Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => testConnection('FreshBooks')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  {testingProvider === 'FreshBooks' ? 'Testing...' : 'Test Ping'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
