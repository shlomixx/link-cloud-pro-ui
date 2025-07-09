import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppHeader } from '@/components/AppHeader';
import { CategorySection } from '@/components/CategorySection';
import { LinkModal } from '@/components/LinkModal';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { LinkData, FormData, ViewMode, SortBy } from '@/types';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [isNewLink, setIsNewLink] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('compact');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPrivateLinks, setShowPrivateLinks] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [clickedLink, setClickedLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompactHeader, setIsCompactHeader] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [quickFilter, setQuickFilter] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    url: '',
    category: 'custom',
    isPrivate: false
  });

  const [linksData, setLinksData] = useState<LinkData[]>([
    // AI Tools (11 links)
    { key: 'chatgpt', name: 'ChatGPT', defaultUrl: 'https://chat.openai.com', category: 'ai', clicks: 67, createdAt: '2024-01-01', isFavorite: true },
    { key: 'claude', name: 'Claude', defaultUrl: 'https://claude.ai', category: 'ai', clicks: 45, createdAt: '2024-01-02' },
    { key: 'midjourney', name: 'Midjourney', defaultUrl: 'https://midjourney.com', category: 'ai', clicks: 38, createdAt: '2024-01-03' },
    { key: 'perplexity', name: 'Perplexity', defaultUrl: 'https://perplexity.ai', category: 'ai', clicks: 34, createdAt: '2024-01-04' },
    { key: 'copilot', name: 'Copilot', defaultUrl: 'https://copilot.microsoft.com', category: 'ai', clicks: 29, createdAt: '2024-01-05' },
    { key: 'bard', name: 'Gemini', defaultUrl: 'https://gemini.google.com', category: 'ai', clicks: 31, createdAt: '2024-01-06' },
    { key: 'runway', name: 'Runway ML', defaultUrl: 'https://runwayml.com', category: 'ai', clicks: 22, createdAt: '2024-01-07' },
    { key: 'huggingface', name: 'Hugging Face', defaultUrl: 'https://huggingface.co', category: 'ai', clicks: 27, createdAt: '2024-01-08' },
    { key: 'replicate', name: 'Replicate', defaultUrl: 'https://replicate.com', category: 'ai', clicks: 19, createdAt: '2024-01-09' },
    { key: 'stability', name: 'Stability AI', defaultUrl: 'https://stability.ai', category: 'ai', clicks: 24, createdAt: '2024-01-10' },
    { key: 'elevenlabs', name: 'ElevenLabs', defaultUrl: 'https://elevenlabs.io', category: 'ai', clicks: 21, createdAt: '2024-01-11' },

    // Shopping (11 links)
    { key: 'amazon', name: 'Amazon', defaultUrl: 'https://www.amazon.com', category: 'shopping', clicks: 89, createdAt: '2024-01-12', isFavorite: true },
    { key: 'ebay', name: 'eBay', defaultUrl: 'https://www.ebay.com', category: 'shopping', clicks: 52, createdAt: '2024-01-13' },
    { key: 'walmart', name: 'Walmart', defaultUrl: 'https://www.walmart.com', category: 'shopping', clicks: 43, createdAt: '2024-01-14' },
    { key: 'target', name: 'Target', defaultUrl: 'https://www.target.com', category: 'shopping', clicks: 38, createdAt: '2024-01-15' },
    { key: 'aliexpress', name: 'AliExpress', defaultUrl: 'https://www.aliexpress.com', category: 'shopping', clicks: 35, createdAt: '2024-01-16' },
    { key: 'costco', name: 'Costco', defaultUrl: 'https://www.costco.com', category: 'shopping', clicks: 29, createdAt: '2024-01-17' },
    { key: 'bestbuy', name: 'Best Buy', defaultUrl: 'https://www.bestbuy.com', category: 'shopping', clicks: 41, createdAt: '2024-01-18' },
    { key: 'etsy', name: 'Etsy', defaultUrl: 'https://www.etsy.com', category: 'shopping', clicks: 33, createdAt: '2024-01-19' },
    { key: 'wayfair', name: 'Wayfair', defaultUrl: 'https://www.wayfair.com', category: 'shopping', clicks: 27, createdAt: '2024-01-20' },
    { key: 'zappos', name: 'Zappos', defaultUrl: 'https://www.zappos.com', category: 'shopping', clicks: 24, createdAt: '2024-01-21' },
    { key: 'overstock', name: 'Overstock', defaultUrl: 'https://www.overstock.com', category: 'shopping', clicks: 18, createdAt: '2024-01-22' },

    // Social (11 links)
    { key: 'facebook', name: 'Facebook', defaultUrl: 'https://www.facebook.com', category: 'social', clicks: 72, createdAt: '2024-01-23' },
    { key: 'instagram', name: 'Instagram', defaultUrl: 'https://www.instagram.com', category: 'social', clicks: 68, createdAt: '2024-01-24', isFavorite: true },
    { key: 'twitter', name: 'X (Twitter)', defaultUrl: 'https://x.com', category: 'social', clicks: 56, createdAt: '2024-01-25' },
    { key: 'linkedin', name: 'LinkedIn', defaultUrl: 'https://www.linkedin.com', category: 'social', clicks: 49, createdAt: '2024-01-26' },
    { key: 'tiktok', name: 'TikTok', defaultUrl: 'https://www.tiktok.com', category: 'social', clicks: 61, createdAt: '2024-01-27' },
    { key: 'reddit', name: 'Reddit', defaultUrl: 'https://www.reddit.com', category: 'social', clicks: 44, createdAt: '2024-01-28' },
    { key: 'discord', name: 'Discord', defaultUrl: 'https://discord.com', category: 'social', clicks: 39, createdAt: '2024-01-29' },
    { key: 'snapchat', name: 'Snapchat', defaultUrl: 'https://web.snapchat.com', category: 'social', clicks: 32, createdAt: '2024-01-30' },
    { key: 'pinterest', name: 'Pinterest', defaultUrl: 'https://www.pinterest.com', category: 'social', clicks: 36, createdAt: '2024-01-31' },
    { key: 'tumblr', name: 'Tumblr', defaultUrl: 'https://www.tumblr.com', category: 'social', clicks: 23, createdAt: '2024-02-01' },
    { key: 'mastodon', name: 'Mastodon', defaultUrl: 'https://mastodon.social', category: 'social', clicks: 19, createdAt: '2024-02-02' },

    // News (11 links)
    { key: 'bbc', name: 'BBC News', defaultUrl: 'https://www.bbc.com/news', category: 'news', clicks: 47, createdAt: '2024-02-03' },
    { key: 'cnn', name: 'CNN', defaultUrl: 'https://www.cnn.com', category: 'news', clicks: 43, createdAt: '2024-02-04' },
    { key: 'reuters', name: 'Reuters', defaultUrl: 'https://www.reuters.com', category: 'news', clicks: 38, createdAt: '2024-02-05' },
    { key: 'ap', name: 'AP News', defaultUrl: 'https://apnews.com', category: 'news', clicks: 35, createdAt: '2024-02-06' },
    { key: 'nytimes', name: 'NY Times', defaultUrl: 'https://www.nytimes.com', category: 'news', clicks: 52, createdAt: '2024-02-07', isFavorite: true },
    { key: 'guardian', name: 'The Guardian', defaultUrl: 'https://www.theguardian.com', category: 'news', clicks: 41, createdAt: '2024-02-08' },
    { key: 'washpost', name: 'Washington Post', defaultUrl: 'https://www.washingtonpost.com', category: 'news', clicks: 34, createdAt: '2024-02-09' },
    { key: 'wsj', name: 'Wall Street Journal', defaultUrl: 'https://www.wsj.com', category: 'news', clicks: 29, createdAt: '2024-02-10' },
    { key: 'npr', name: 'NPR', defaultUrl: 'https://www.npr.org', category: 'news', clicks: 27, createdAt: '2024-02-11' },
    { key: 'economist', name: 'The Economist', defaultUrl: 'https://www.economist.com', category: 'news', clicks: 24, createdAt: '2024-02-12' },
    { key: 'bloomberg', name: 'Bloomberg', defaultUrl: 'https://www.bloomberg.com', category: 'news', clicks: 31, createdAt: '2024-02-13' },

    // Media/Streaming (11 links)
    { key: 'youtube', name: 'YouTube', defaultUrl: 'https://www.youtube.com', category: 'streaming', clicks: 95, createdAt: '2024-02-14', isFavorite: true },
    { key: 'netflix', name: 'Netflix', defaultUrl: 'https://www.netflix.com', category: 'streaming', clicks: 78, createdAt: '2024-02-15' },
    { key: 'spotify', name: 'Spotify', defaultUrl: 'https://www.spotify.com', category: 'streaming', clicks: 63, createdAt: '2024-02-16' },
    { key: 'twitch', name: 'Twitch', defaultUrl: 'https://www.twitch.tv', category: 'streaming', clicks: 45, createdAt: '2024-02-17' },
    { key: 'prime', name: 'Prime Video', defaultUrl: 'https://www.primevideo.com', category: 'streaming', clicks: 51, createdAt: '2024-02-18' },
    { key: 'hulu', name: 'Hulu', defaultUrl: 'https://www.hulu.com', category: 'streaming', clicks: 39, createdAt: '2024-02-19' },
    { key: 'disney', name: 'Disney+', defaultUrl: 'https://www.disneyplus.com', category: 'streaming', clicks: 42, createdAt: '2024-02-20' },
    { key: 'hbo', name: 'Max (HBO)', defaultUrl: 'https://www.max.com', category: 'streaming', clicks: 36, createdAt: '2024-02-21' },
    { key: 'paramount', name: 'Paramount+', defaultUrl: 'https://www.paramountplus.com', category: 'streaming', clicks: 28, createdAt: '2024-02-22' },
    { key: 'appletv', name: 'Apple TV+', defaultUrl: 'https://tv.apple.com', category: 'streaming', clicks: 31, createdAt: '2024-02-23' },
    { key: 'peacock', name: 'Peacock', defaultUrl: 'https://www.peacocktv.com', category: 'streaming', clicks: 24, createdAt: '2024-02-24' },

    // Tools/Utilities (11 links)
    { key: 'google', name: 'Google', defaultUrl: 'https://www.google.com', category: 'tools', clicks: 102, createdAt: '2024-02-25', isFavorite: true },
    { key: 'gmail', name: 'Gmail', defaultUrl: 'https://mail.google.com', category: 'tools', clicks: 87, createdAt: '2024-02-26' },
    { key: 'googledrive', name: 'Google Drive', defaultUrl: 'https://drive.google.com', category: 'tools', clicks: 64, createdAt: '2024-02-27' },
    { key: 'github', name: 'GitHub', defaultUrl: 'https://www.github.com', category: 'tools', clicks: 58, createdAt: '2024-02-28' },
    { key: 'dropbox', name: 'Dropbox', defaultUrl: 'https://www.dropbox.com', category: 'tools', clicks: 43, createdAt: '2024-03-01' },
    { key: 'onedrive', name: 'OneDrive', defaultUrl: 'https://onedrive.live.com', category: 'tools', clicks: 37, createdAt: '2024-03-02' },
    { key: 'cloudflare', name: 'Cloudflare', defaultUrl: 'https://www.cloudflare.com', category: 'tools', clicks: 29, createdAt: '2024-03-03' },
    { key: 'canva', name: 'Canva', defaultUrl: 'https://www.canva.com', category: 'tools', clicks: 52, createdAt: '2024-03-04' },
    { key: 'notion', name: 'Notion', defaultUrl: 'https://www.notion.so', category: 'tools', clicks: 48, createdAt: '2024-03-05' },
    { key: 'airtable', name: 'Airtable', defaultUrl: 'https://airtable.com', category: 'tools', clicks: 31, createdAt: '2024-03-06' },
    { key: 'zapier', name: 'Zapier', defaultUrl: 'https://zapier.com', category: 'tools', clicks: 26, createdAt: '2024-03-07' },

    // Finance/Money (11 links)
    { key: 'paypal', name: 'PayPal', defaultUrl: 'https://www.paypal.com', category: 'finance', clicks: 67, createdAt: '2024-03-08' },
    { key: 'mint', name: 'Mint', defaultUrl: 'https://mint.intuit.com', category: 'finance', clicks: 45, createdAt: '2024-03-09' },
    { key: 'quickbooks', name: 'QuickBooks', defaultUrl: 'https://quickbooks.intuit.com', category: 'finance', clicks: 38, createdAt: '2024-03-10' },
    { key: 'stripe', name: 'Stripe', defaultUrl: 'https://stripe.com', category: 'finance', clicks: 33, createdAt: '2024-03-11' },
    { key: 'square', name: 'Square', defaultUrl: 'https://squareup.com', category: 'finance', clicks: 29, createdAt: '2024-03-12' },
    { key: 'venmo', name: 'Venmo', defaultUrl: 'https://venmo.com', category: 'finance', clicks: 42, createdAt: '2024-03-13' },
    { key: 'cashapp', name: 'Cash App', defaultUrl: 'https://cash.app', category: 'finance', clicks: 36, createdAt: '2024-03-14' },
    { key: 'zelle', name: 'Zelle', defaultUrl: 'https://www.zellepay.com', category: 'finance', clicks: 31, createdAt: '2024-03-15' },
    { key: 'creditkarma', name: 'Credit Karma', defaultUrl: 'https://www.creditkarma.com', category: 'finance', clicks: 27, createdAt: '2024-03-16' },
    { key: 'experian', name: 'Experian', defaultUrl: 'https://www.experian.com', category: 'finance', clicks: 23, createdAt: '2024-03-17' },
    { key: 'nerdwallet', name: 'NerdWallet', defaultUrl: 'https://www.nerdwallet.com', category: 'finance', clicks: 25, createdAt: '2024-03-18' },

    // Gaming (11 links)
    { key: 'steam', name: 'Steam', defaultUrl: 'https://store.steampowered.com', category: 'gaming', clicks: 76, createdAt: '2024-03-19', isFavorite: true },
    { key: 'epicgames', name: 'Epic Games', defaultUrl: 'https://www.epicgames.com', category: 'gaming', clicks: 54, createdAt: '2024-03-20' },
    { key: 'playstation', name: 'PlayStation', defaultUrl: 'https://www.playstation.com', category: 'gaming', clicks: 48, createdAt: '2024-03-21' },
    { key: 'xbox', name: 'Xbox', defaultUrl: 'https://www.xbox.com', category: 'gaming', clicks: 43, createdAt: '2024-03-22' },
    { key: 'nintendo', name: 'Nintendo', defaultUrl: 'https://www.nintendo.com', category: 'gaming', clicks: 39, createdAt: '2024-03-23' },
    { key: 'itch', name: 'itch.io', defaultUrl: 'https://itch.io', category: 'gaming', clicks: 28, createdAt: '2024-03-24' },
    { key: 'gog', name: 'GOG', defaultUrl: 'https://www.gog.com', category: 'gaming', clicks: 32, createdAt: '2024-03-25' },
    { key: 'battlenet', name: 'Battle.net', defaultUrl: 'https://battle.net', category: 'gaming', clicks: 36, createdAt: '2024-03-26' },
    { key: 'origin', name: 'EA Origin', defaultUrl: 'https://www.origin.com', category: 'gaming', clicks: 24, createdAt: '2024-03-27' },
    { key: 'uplay', name: 'Ubisoft Connect', defaultUrl: 'https://ubisoftconnect.com', category: 'gaming', clicks: 21, createdAt: '2024-03-28' },
    { key: 'gamepass', name: 'Game Pass', defaultUrl: 'https://www.xbox.com/xbox-game-pass', category: 'gaming', clicks: 41, createdAt: '2024-03-29' },

    // Travel (11 links)
    { key: 'booking', name: 'Booking.com', defaultUrl: 'https://www.booking.com', category: 'travel', clicks: 58, createdAt: '2024-03-30' },
    { key: 'expedia', name: 'Expedia', defaultUrl: 'https://www.expedia.com', category: 'travel', clicks: 52, createdAt: '2024-03-31' },
    { key: 'airbnb', name: 'Airbnb', defaultUrl: 'https://www.airbnb.com', category: 'travel', clicks: 61, createdAt: '2024-04-01', isFavorite: true },
    { key: 'kayak', name: 'Kayak', defaultUrl: 'https://www.kayak.com', category: 'travel', clicks: 43, createdAt: '2024-04-02' },
    { key: 'skyscanner', name: 'Skyscanner', defaultUrl: 'https://www.skyscanner.com', category: 'travel', clicks: 39, createdAt: '2024-04-03' },
    { key: 'tripadvisor', name: 'TripAdvisor', defaultUrl: 'https://www.tripadvisor.com', category: 'travel', clicks: 47, createdAt: '2024-04-04' },
    { key: 'priceline', name: 'Priceline', defaultUrl: 'https://www.priceline.com', category: 'travel', clicks: 33, createdAt: '2024-04-05' },
    { key: 'hotels', name: 'Hotels.com', defaultUrl: 'https://www.hotels.com', category: 'travel', clicks: 36, createdAt: '2024-04-06' },
    { key: 'trivago', name: 'Trivago', defaultUrl: 'https://www.trivago.com', category: 'travel', clicks: 29, createdAt: '2024-04-07' },
    { key: 'orbitz', name: 'Orbitz', defaultUrl: 'https://www.orbitz.com', category: 'travel', clicks: 25, createdAt: '2024-04-08' },
    { key: 'vrbo', name: 'VRBO', defaultUrl: 'https://www.vrbo.com', category: 'travel', clicks: 31, createdAt: '2024-04-09' },

    // Food (11 links)
    { key: 'doordash', name: 'DoorDash', defaultUrl: 'https://www.doordash.com', category: 'food', clicks: 73, createdAt: '2024-04-10' },
    { key: 'ubereats', name: 'Uber Eats', defaultUrl: 'https://www.ubereats.com', category: 'food', clicks: 68, createdAt: '2024-04-11' },
    { key: 'grubhub', name: 'Grubhub', defaultUrl: 'https://www.grubhub.com', category: 'food', clicks: 54, createdAt: '2024-04-12' },
    { key: 'allrecipes', name: 'AllRecipes', defaultUrl: 'https://www.allrecipes.com', category: 'food', clicks: 42, createdAt: '2024-04-13' },
    { key: 'foodnetwork', name: 'Food Network', defaultUrl: 'https://www.foodnetwork.com', category: 'food', clicks: 39, createdAt: '2024-04-14' },
    { key: 'epicurious', name: 'Epicurious', defaultUrl: 'https://www.epicurious.com', category: 'food', clicks: 31, createdAt: '2024-04-15' },
    { key: 'yelp', name: 'Yelp', defaultUrl: 'https://www.yelp.com', category: 'food', clicks: 47, createdAt: '2024-04-16' },
    { key: 'opentable', name: 'OpenTable', defaultUrl: 'https://www.opentable.com', category: 'food', clicks: 35, createdAt: '2024-04-17' },
    { key: 'zomato', name: 'Zomato', defaultUrl: 'https://www.zomato.com', category: 'food', clicks: 28, createdAt: '2024-04-18' },
    { key: 'seamless', name: 'Seamless', defaultUrl: 'https://www.seamless.com', category: 'food', clicks: 33, createdAt: '2024-04-19' },
    { key: 'postmates', name: 'Postmates', defaultUrl: 'https://postmates.com', category: 'food', clicks: 24, createdAt: '2024-04-20' },

    // Education/Learning (11 links)
    { key: 'coursera', name: 'Coursera', defaultUrl: 'https://www.coursera.org', category: 'education', clicks: 56, createdAt: '2024-04-21' },
    { key: 'udemy', name: 'Udemy', defaultUrl: 'https://www.udemy.com', category: 'education', clicks: 48, createdAt: '2024-04-22' },
    { key: 'khan', name: 'Khan Academy', defaultUrl: 'https://www.khanacademy.org', category: 'education', clicks: 52, createdAt: '2024-04-23', isFavorite: true },
    { key: 'edx', name: 'edX', defaultUrl: 'https://www.edx.org', category: 'education', clicks: 41, createdAt: '2024-04-24' },
    { key: 'skillshare', name: 'Skillshare', defaultUrl: 'https://www.skillshare.com', category: 'education', clicks: 37, createdAt: '2024-04-25' },
    { key: 'masterclass', name: 'MasterClass', defaultUrl: 'https://www.masterclass.com', category: 'education', clicks: 43, createdAt: '2024-04-26' },
    { key: 'pluralsight', name: 'Pluralsight', defaultUrl: 'https://www.pluralsight.com', category: 'education', clicks: 33, createdAt: '2024-04-27' },
    { key: 'brilliant', name: 'Brilliant', defaultUrl: 'https://brilliant.org', category: 'education', clicks: 29, createdAt: '2024-04-28' },
    { key: 'codecademy', name: 'Codecademy', defaultUrl: 'https://www.codecademy.com', category: 'education', clicks: 35, createdAt: '2024-04-29' },
    { key: 'duolingo', name: 'Duolingo', defaultUrl: 'https://www.duolingo.com', category: 'education', clicks: 46, createdAt: '2024-04-30' },
    { key: 'ted', name: 'TED', defaultUrl: 'https://www.ted.com', category: 'education', clicks: 31, createdAt: '2024-05-01' },
  ]);

  const categoryLabels = {
    ai: 'AI Tools',
    shopping: 'Shopping',
    social: 'Social',
    news: 'News',
    streaming: 'Media',
    tools: 'Utilities',
    finance: 'Money',
    gaming: 'Gaming',
    travel: 'Travel',
    food: 'Food',
    education: 'Learn',
    services: 'Services',
    health: 'Health',
    sports: 'Sports',
    music: 'Audio',
    photography: 'Photo',
    design: 'Design',
    productivity: 'Work',
    communication: 'Chat',
    entertainment: 'Fun',
    business: 'Business',
    technology: 'Dev',
    science: 'Science',
    art: 'Arts',
    books: 'Read',
    cooking: 'Cook',
    diy: 'DIY',
    pets: 'Pets',
    automotive: 'Cars',
    real_estate: 'Property',
    fashion: 'Style',
    weather: 'Weather',
    maps: 'Maps',
    government: 'Gov',
    legal: 'Legal',
    insurance: 'Insurance',
    banking: 'Banking',
    investing: 'Invest',
    cryptocurrency: 'Crypto',
    freelance: 'Jobs',
    learning: 'Courses',
    languages: 'Languages',
    meditation: 'Wellness',
    dating: 'Dating',
    parenting: 'Family',
    seniors: 'Seniors',
    kids: 'Kids',
    local: 'Local',
    utilities: 'Bills',
    security: 'Security',
    custom: 'Custom'
  };

  const categoryColors = {
    ai: 'from-purple-500 to-pink-500',
    shopping: 'from-yellow-500 to-orange-500',
    social: 'from-blue-500 to-cyan-500',
    news: 'from-red-500 to-rose-500',
    streaming: 'from-green-500 to-emerald-500',
    tools: 'from-gray-600 to-gray-800',
    finance: 'from-emerald-600 to-teal-600',
    gaming: 'from-violet-500 to-purple-600',
    travel: 'from-sky-500 to-blue-600',
    food: 'from-orange-500 to-red-500',
    education: 'from-indigo-500 to-blue-600',
    services: 'from-teal-500 to-cyan-600',
    health: 'from-green-400 to-emerald-500',
    sports: 'from-orange-600 to-red-600',
    music: 'from-pink-500 to-rose-500',
    photography: 'from-purple-400 to-violet-500',
    design: 'from-fuchsia-500 to-pink-600',
    productivity: 'from-blue-600 to-indigo-600',
    communication: 'from-cyan-500 to-blue-500',
    entertainment: 'from-amber-500 to-orange-600',
    business: 'from-slate-700 to-gray-800',
    technology: 'from-blue-500 to-purple-600',
    science: 'from-teal-600 to-green-600',
    art: 'from-rose-500 to-pink-600',
    books: 'from-amber-600 to-yellow-600',
    cooking: 'from-red-500 to-orange-500',
    diy: 'from-yellow-600 to-amber-600',
    pets: 'from-green-500 to-teal-500',
    automotive: 'from-gray-700 to-slate-800',
    real_estate: 'from-emerald-700 to-green-700',
    fashion: 'from-pink-600 to-rose-600',
    weather: 'from-sky-400 to-blue-500',
    maps: 'from-green-600 to-emerald-600',
    government: 'from-blue-700 to-indigo-700',
    legal: 'from-slate-600 to-gray-700',
    insurance: 'from-blue-600 to-cyan-600',
    banking: 'from-green-700 to-emerald-700',
    investing: 'from-emerald-600 to-green-600',
    cryptocurrency: 'from-yellow-500 to-amber-500',
    freelance: 'from-purple-600 to-violet-600',
    learning: 'from-indigo-600 to-purple-600',
    languages: 'from-rose-600 to-pink-600',
    meditation: 'from-green-400 to-teal-400',
    dating: 'from-pink-500 to-rose-500',
    parenting: 'from-blue-400 to-cyan-400',
    seniors: 'from-gray-500 to-slate-600',
    kids: 'from-yellow-400 to-orange-400',
    local: 'from-teal-600 to-cyan-600',
    utilities: 'from-gray-600 to-slate-700',
    security: 'from-red-600 to-rose-600',
    custom: 'from-slate-600 to-gray-700'
  };

  useEffect(() => {
    setIsLoading(true);
    const saved = localStorage.getItem('linkRouterData');
    const savedSettings = localStorage.getItem('linkRouterSettings');
    
    setTimeout(() => {
      if (saved) {
        try {
          setLinksData(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading saved links:', error);
          toast.error('Failed to load saved links');
        }
      }
      
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          setIsDarkMode(settings.isDarkMode ?? true);
          setViewMode(settings.viewMode ?? 'compact');
          setSortBy(settings.sortBy ?? 'name');
          setShowPrivateLinks(settings.showPrivateLinks ?? true);
          setIsCompactHeader(settings.isCompactHeader ?? false);
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      }
      setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    localStorage.setItem('linkRouterData', JSON.stringify(linksData));
  }, [linksData]);

  useEffect(() => {
    const settings = { isDarkMode, viewMode, sortBy, showPrivateLinks, isCompactHeader };
    localStorage.setItem('linkRouterSettings', JSON.stringify(settings));
    
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, viewMode, sortBy, showPrivateLinks, isCompactHeader]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            searchInputRef.current?.focus();
            searchInputRef.current?.select();
            break;
          case 'n':
            e.preventDefault();
            openModal();
            break;
          case 'g':
            e.preventDefault();
            const modes: ViewMode[] = ['compact', 'grid', 'list', 'dense'];
            const currentIndex = modes.indexOf(viewMode);
            const nextMode = modes[(currentIndex + 1) % modes.length];
            setViewMode(nextMode);
            toast.success(`Switched to ${nextMode} view`);
            break;
          case 'd':
            e.preventDefault();
            setIsDarkMode(!isDarkMode);
            toast.success(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`);
            break;
          case 'h':
            e.preventDefault();
            setIsCompactHeader(!isCompactHeader);
            toast.success(`Header ${isCompactHeader ? 'expanded' : 'compact'}`);
            break;
        }
      }
      
      if (e.altKey) {
        switch (e.key) {
          case 'f':
            e.preventDefault();
            handleQuickAction('favorites');
            break;
          case 'r':
            e.preventDefault();
            handleQuickAction('recent');
            break;
          case 'p':
            e.preventDefault();
            handleQuickAction('popular');
            break;
        }
      }
      
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      
      if (e.key === 'Escape') {
        if (isModalOpen) {
          closeModal();
        } else if (showShortcuts) {
          setShowShortcuts(false);
        } else if (searchTerm) {
          setSearchTerm('');
          searchInputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isDarkMode, isModalOpen, searchTerm, isCompactHeader, showShortcuts]);

  const handleQuickAction = (action: string) => {
    setQuickFilter(action);
    switch (action) {
      case 'favorites':
        setSortBy('favorites');
        toast.success('Showing favorite links');
        break;
      case 'recent':
        setSortBy('recent');
        toast.success('Showing recent links');
        break;
      case 'popular':
        setSortBy('clicks');
        toast.success('Showing popular links');
        break;
      default:
        setSortBy('name');
        setQuickFilter('all');
    }
  };

  const handleLinkClick = (link: LinkData) => {
    setClickedLink(link.key);
    
    setLinksData(prev => prev.map(l => 
      l.key === link.key ? { 
        ...l, 
        clicks: (l.clicks || 0) + 1,
        lastClicked: new Date().toISOString()
      } : l
    ));

    setTimeout(() => setClickedLink(null), 200);
    
    // Actually open the link in a new tab
    const url = link.url || link.defaultUrl;
    if (url) {
      window.open(url, '_blank');
    }
    
    toast.success(`Opening ${link.name}...`, {
      duration: 2000,
      action: {
        label: 'Undo',
        onClick: () => toast.info('Link opening cancelled')
      }
    });
  };

  const toggleFavorite = (linkKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLinksData(prev => prev.map(link => 
      link.key === linkKey 
        ? { ...link, isFavorite: !link.isFavorite }
        : link
    ));
    
    const link = linksData.find(l => l.key === linkKey);
    const isFavorite = link?.isFavorite;
    
    toast.success(
      isFavorite ? `Removed ${link?.name} from favorites` : `Added ${link?.name} to favorites`,
      { duration: 2000 }
    );
  };

  const sortLinks = (links: LinkData[]) => {
    switch (sortBy) {
      case 'clicks':
        return [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      case 'recent':
        return [...links].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      case 'favorites':
        return [...links].sort((a, b) => {
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return (b.clicks || 0) - (a.clicks || 0);
        });
      default:
        return [...links].sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const filteredLinks = linksData.filter(link => {
    if (!showPrivateLinks && link.isPrivate) return false;
    if (selectedCategory !== 'all' && link.category !== selectedCategory) return false;
    
    // Apply quick filter
    if (quickFilter === 'favorites' && !link.isFavorite) return false;
    if (quickFilter === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (new Date(link.createdAt || '') < weekAgo) return false;
    }
    if (quickFilter === 'popular' && (link.clicks || 0) < 20) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      link.name.toLowerCase().includes(searchLower) ||
      (link.url || link.defaultUrl || '').toLowerCase().includes(searchLower) ||
      link.category.toLowerCase().includes(searchLower)
    );
  });

  const groupedLinks = filteredLinks.reduce((acc, link) => {
    const category = link.category || 'custom';
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {} as Record<string, LinkData[]>);

  Object.keys(groupedLinks).forEach(category => {
    groupedLinks[category] = sortLinks(groupedLinks[category]);
  });

  const openModal = (link?: LinkData, presetCategory?: string) => {
    if (link) {
      setEditingLink(link);
      setIsNewLink(false);
      setFormData({
        name: link.name,
        url: link.url || link.defaultUrl || '',
        category: link.category,
        isPrivate: link.isPrivate || false
      });
    } else {
      setEditingLink(null);
      setIsNewLink(true);
      setFormData({
        name: '',
        url: '',
        category: presetCategory || 'custom',
        isPrivate: false
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
    setIsNewLink(false);
    setFormData({ name: '', url: '', category: 'custom', isPrivate: false });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('Please fill in both name and URL');
      return;
    }

    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    let url = formData.url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (isNewLink) {
      const newLink: LinkData = {
        key: `custom_${Date.now()}`,
        name: formData.name.trim(),
        url: url,
        category: formData.category,
        isPrivate: formData.isPrivate,
        clicks: 0,
        createdAt: new Date().toISOString()
      };
      setLinksData(prev => [...prev, newLink]);
      toast.success(`${formData.name} added successfully!`, {
        description: 'Your new link is ready to use',
        action: {
          label: 'View',
          onClick: () => window.open(url, '_blank')
        }
      });
    } else if (editingLink) {
      setLinksData(prev => prev.map(link => 
        link.key === editingLink.key
          ? { ...link, name: formData.name.trim(), url: url, category: formData.category, isPrivate: formData.isPrivate }
          : link
      ));
      toast.success(`${formData.name} updated successfully!`);
    }

    setIsLoading(false);
    closeModal();
  };

  const handleDelete = async () => {
    if (editingLink) {
      setIsLoading(true);
      
      const confirmed = window.confirm(`Are you sure you want to delete "${editingLink.name}"?`);
      if (!confirmed) {
        setIsLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 300));
      
      setLinksData(prev => prev.filter(link => link.key !== editingLink.key));
      toast.success(`${editingLink.name} deleted successfully`, {
        action: {
          label: 'Undo',
          onClick: () => {
            setLinksData(prev => [...prev, editingLink]);
            toast.success('Link restored');
          }
        }
      });
      setIsLoading(false);
      closeModal();
    }
  };

  const handleDragStart = (key: string) => {
    setDraggedItem(key);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    
    // Try to get internal drag data first
    try {
      const dragData = e.dataTransfer.getData('application/json');
      if (dragData) {
        const parsed = JSON.parse(dragData);
        if (parsed.type === 'link' && parsed.key) {
          setLinksData(prev => prev.map(link => 
            link.key === parsed.key ? { ...link, category: targetCategory } : link
          ));
          setDraggedItem(null);
          toast.success('Link moved to new category!');
          return;
        }
      }
    } catch (error) {
      // Fall back to the old method if JSON parsing fails
    }
    
    // Fallback for the draggedItem state method
    if (draggedItem) {
      setLinksData(prev => prev.map(link => 
        link.key === draggedItem ? { ...link, category: targetCategory } : link
      ));
      setDraggedItem(null);
      toast.success('Link moved to new category!');
    }
  };

  const handleDropUrl = async (url: string, targetCategory: string) => {
    try {
      // Extract domain name for the link title
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      const name = domain.charAt(0).toUpperCase() + domain.slice(1);

      const newLink: LinkData = {
        key: `dropped_${Date.now()}`,
        name: name,
        url: url,
        category: targetCategory,
        isPrivate: false,
        clicks: 0,
        createdAt: new Date().toISOString()
      };

      setLinksData(prev => [...prev, newLink]);
      toast.success(`${name} added to ${categoryLabels[targetCategory as keyof typeof categoryLabels] || targetCategory}!`, {
        description: 'Link created from dropped URL',
        action: {
          label: 'View',
          onClick: () => window.open(url, '_blank')
        }
      });
    } catch (error) {
      toast.error('Invalid URL dropped');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(linksData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'link-router-data.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setLinksData(importedData);
          toast.success('Data imported successfully!');
        } catch (error) {
          toast.error('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const copyLinkUrl = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`${name} link copied to clipboard!`);
  };

  const categories = Array.from(new Set(linksData.map(link => link.category)));
  const totalClicks = linksData.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const favoriteLinks = linksData.filter(link => link.isFavorite);
  const recentLinks = linksData.filter(link => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(link.createdAt || '') > weekAgo;
  });
  const popularLinks = linksData.filter(link => (link.clicks || 0) > 20);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 bg-background`}>
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Loading your links...
          </p>
        </div>
      </div>
    );
  }

  const getCompatibleViewMode = (mode: ViewMode): "grid" | "list" | "compact" => {
    if (mode === 'dense') return 'compact';
    return mode as "grid" | "list" | "compact";
  };

  return (
    <div className={`min-h-screen transition-all duration-500 bg-background`}>
      <AppHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchInputRef={searchInputRef}
        viewMode={getCompatibleViewMode(viewMode)}
        onViewModeChange={(mode) => setViewMode(mode as ViewMode)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isCompactHeader={isCompactHeader}
        onToggleCompactHeader={() => setIsCompactHeader(!isCompactHeader)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        categoryLabels={categoryLabels}
        showPrivateLinks={showPrivateLinks}
        onTogglePrivateLinks={() => setShowPrivateLinks(!showPrivateLinks)}
        onExportData={exportData}
        onImportData={() => fileInputRef.current?.click()}
        onAddLink={() => openModal()}
        onShowShortcuts={() => setShowShortcuts(true)}
        linksCount={linksData.length}
        totalClicks={totalClicks}
        favoriteCount={favoriteLinks.length}
        categoriesCount={categories.length}
        fileInputRef={fileInputRef}
        onQuickAction={handleQuickAction}
        recentCount={recentLinks.length}
        popularCount={popularLinks.length}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        {/* Desktop: Show only first 8 categories */}
        <div className="hidden md:block">
          {Object.entries(groupedLinks).slice(0, 8).map(([category, links]) => (
            <CategorySection
              key={category}
              category={category}
              links={links}
              categoryLabels={categoryLabels}
              categoryColors={categoryColors}
              viewMode={viewMode}
              isDarkMode={isDarkMode}
              draggedItem={draggedItem}
              hoveredLink={hoveredLink}
              clickedLink={clickedLink}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onLinkClick={handleLinkClick}
              onToggleFavorite={toggleFavorite}
              onEditLink={openModal}
              onCopyUrl={copyLinkUrl}
              onMouseEnter={setHoveredLink}
              onMouseLeave={() => setHoveredLink(null)}
              onDragStart={handleDragStart}
              onAddLink={(category) => openModal(undefined, category)}
              onDropUrl={handleDropUrl}
            />
          ))}
        </div>

        {/* Mobile: Show all categories */}
        <div className="md:hidden">
          {Object.entries(groupedLinks).map(([category, links]) => (
            <CategorySection
              key={category}
              category={category}
              links={links}
              categoryLabels={categoryLabels}
              categoryColors={categoryColors}
              viewMode={viewMode}
              isDarkMode={isDarkMode}
              draggedItem={draggedItem}
              hoveredLink={hoveredLink}
              clickedLink={clickedLink}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onLinkClick={handleLinkClick}
              onToggleFavorite={toggleFavorite}
              onEditLink={openModal}
              onCopyUrl={copyLinkUrl}
              onMouseEnter={setHoveredLink}
              onMouseLeave={() => setHoveredLink(null)}
              onDragStart={handleDragStart}
              onAddLink={(category) => openModal(undefined, category)}
              onDropUrl={handleDropUrl}
            />
          ))}
        </div>

        {/* Enhanced Empty State */}
        {Object.keys(groupedLinks).length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-6 animate-bounce">🔗</div>
            <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              {searchTerm || quickFilter !== 'all' ? 'No links found' : 'Your link collection awaits'}
            </h3>
            <p className={`mb-8 text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {searchTerm 
                ? `No links match "${searchTerm}". Try adjusting your search terms.`
                : quickFilter !== 'all'
                ? `No ${quickFilter} links found. Try a different filter.`
                : 'Add your first link to start building your personal link hub'
              }
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => openModal()} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                {searchTerm || quickFilter !== 'all' ? 'Add New Link' : 'Add Your First Link'}
              </Button>
              {(searchTerm || quickFilter !== 'all') && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setQuickFilter('all');
                    setSortBy('name');
                  }}
                  className={`px-6 py-3 text-lg transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'border-white/20 text-white hover:bg-white/10' 
                      : 'border-black/20 text-slate-800 hover:bg-black/10'
                  }`}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => openModal()}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 group"
      >
        <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
      </Button>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importData}
        className="hidden"
      />

      <LinkModal
        isOpen={isModalOpen}
        onClose={closeModal}
        isNewLink={isNewLink}
        formData={formData}
        onFormDataChange={setFormData}
        onSave={handleSave}
        onDelete={handleDelete}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        categoryLabels={categoryLabels}
      />

      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Index;
