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
    { key: 'google', name: 'Google', defaultUrl: 'https://www.google.com', category: 'tools', clicks: 45, createdAt: '2024-01-01', isFavorite: true },
    { key: 'youtube', name: 'YouTube', defaultUrl: 'https://www.youtube.com', category: 'streaming', clicks: 32, createdAt: '2024-01-02' },
    { key: 'facebook', name: 'Facebook', defaultUrl: 'https://www.facebook.com', category: 'social', clicks: 28, createdAt: '2024-01-03' },
    { key: 'amazon', name: 'Amazon', defaultUrl: 'https://www.amazon.com', category: 'shopping', clicks: 19, createdAt: '2024-01-04', isFavorite: true },
    { key: 'netflix', name: 'Netflix', defaultUrl: 'https://www.netflix.com', category: 'streaming', clicks: 41, createdAt: '2024-01-05' },
    { key: 'wikipedia', name: 'Wikipedia', defaultUrl: 'https://www.wikipedia.org', category: 'education', clicks: 15, createdAt: '2024-01-06' },
    { key: 'ynet', name: 'Ynet News', defaultUrl: 'https://www.ynet.co.il', category: 'news', clicks: 23, createdAt: '2024-01-07' },
    { key: 'walla', name: 'Walla News', defaultUrl: 'https://www.walla.co.il', category: 'news', clicks: 18, createdAt: '2024-01-08' },
    { key: 'mako', name: 'Mako', defaultUrl: 'https://www.mako.co.il', category: 'news', clicks: 12, createdAt: '2024-01-09' },
    { key: 'haaretz', name: 'Haaretz', defaultUrl: 'https://www.haaretz.co.il', category: 'news', clicks: 8, createdAt: '2024-01-10' },
    { key: 'chatgpt', name: 'ChatGPT', defaultUrl: 'https://chat.openai.com', category: 'ai', clicks: 67, createdAt: '2024-01-11', isFavorite: true },
    { key: 'mail', name: 'Gmail', defaultUrl: 'https://mail.google.com', category: 'tools', clicks: 89, createdAt: '2024-01-12' },
    { key: 'spotify', name: 'Spotify', defaultUrl: 'https://www.spotify.com', category: 'streaming', clicks: 36, createdAt: '2024-01-13' },
    { key: 'instagram', name: 'Instagram', defaultUrl: 'https://www.instagram.com', category: 'social', clicks: 52, createdAt: '2024-01-14' },
    { key: 'twitter', name: 'Twitter', defaultUrl: 'https://www.twitter.com', category: 'social', clicks: 38, createdAt: '2024-01-15' },
    { key: 'linkedin', name: 'LinkedIn', defaultUrl: 'https://www.linkedin.com', category: 'social', clicks: 24, createdAt: '2024-01-16' },
    { key: 'github', name: 'GitHub', defaultUrl: 'https://www.github.com', category: 'tools', clicks: 61, createdAt: '2024-01-17', isFavorite: true },
    { key: 'stackoverflow', name: 'Stack Overflow', defaultUrl: 'https://stackoverflow.com', category: 'tools', clicks: 34, createdAt: '2024-01-18' },
    { key: 'discord', name: 'Discord', defaultUrl: 'https://discord.com', category: 'social', clicks: 29, createdAt: '2024-01-19' },
    { key: 'duolingo', name: 'Duolingo', defaultUrl: 'https://www.duolingo.com', category: 'languages', clicks: 22, createdAt: '2024-01-20' },
    { key: 'coursera', name: 'Coursera', defaultUrl: 'https://www.coursera.org', category: 'learning', clicks: 18, createdAt: '2024-01-21' },
    { key: 'figma', name: 'Figma', defaultUrl: 'https://www.figma.com', category: 'design', clicks: 31, createdAt: '2024-01-22', isFavorite: true },
    { key: 'notion', name: 'Notion', defaultUrl: 'https://www.notion.so', category: 'productivity', clicks: 45, createdAt: '2024-01-23' },
    { key: 'slack', name: 'Slack', defaultUrl: 'https://slack.com', category: 'communication', clicks: 38, createdAt: '2024-01-24' },
    { key: 'zoom', name: 'Zoom', defaultUrl: 'https://zoom.us', category: 'communication', clicks: 42, createdAt: '2024-01-25' },
    { key: 'canva', name: 'Canva', defaultUrl: 'https://www.canva.com', category: 'design', clicks: 27, createdAt: '2024-01-26' },
    { key: 'unsplash', name: 'Unsplash', defaultUrl: 'https://unsplash.com', category: 'photography', clicks: 19, createdAt: '2024-01-27' },
    { key: 'myfitnesspal', name: 'MyFitnessPal', defaultUrl: 'https://www.myfitnesspal.com', category: 'health', clicks: 16, createdAt: '2024-01-28' },
    { key: 'espn', name: 'ESPN', defaultUrl: 'https://www.espn.com', category: 'sports', clicks: 25, createdAt: '2024-01-29' },
    { key: 'soundcloud', name: 'SoundCloud', defaultUrl: 'https://soundcloud.com', category: 'music', clicks: 21, createdAt: '2024-01-30' },
    { key: 'coinbase', name: 'Coinbase', defaultUrl: 'https://www.coinbase.com', category: 'cryptocurrency', clicks: 14, createdAt: '2024-01-31' },
    { key: 'upwork', name: 'Upwork', defaultUrl: 'https://www.upwork.com', category: 'freelance', clicks: 17, createdAt: '2024-02-01' },
    { key: 'goodreads', name: 'Goodreads', defaultUrl: 'https://www.goodreads.com', category: 'books', clicks: 13, createdAt: '2024-02-02' },
    { key: 'allrecipes', name: 'AllRecipes', defaultUrl: 'https://www.allrecipes.com', category: 'cooking', clicks: 20, createdAt: '2024-02-03' },
    { key: 'pinterest', name: 'Pinterest', defaultUrl: 'https://www.pinterest.com', category: 'diy', clicks: 26, createdAt: '2024-02-04' },
    { key: 'weather', name: 'Weather.com', defaultUrl: 'https://weather.com', category: 'weather', clicks: 11, createdAt: '2024-02-05' },
    { key: 'googlemaps', name: 'Google Maps', defaultUrl: 'https://maps.google.com', category: 'maps', clicks: 33, createdAt: '2024-02-06' },
    { key: 'trello', name: 'Trello', defaultUrl: 'https://trello.com', category: 'productivity', clicks: 28, createdAt: '2024-02-07' },
    { key: 'adobe', name: 'Adobe Creative Cloud', defaultUrl: 'https://www.adobe.com', category: 'design', clicks: 35, createdAt: '2024-02-08' },
    { key: 'behance', name: 'Behance', defaultUrl: 'https://www.behance.net', category: 'art', clicks: 15, createdAt: '2024-02-09' },
    { key: 'dribbble', name: 'Dribbble', defaultUrl: 'https://dribbble.com', category: 'design', clicks: 22, createdAt: '2024-02-10' },
    { key: 'medium', name: 'Medium', defaultUrl: 'https://medium.com', category: 'books', clicks: 19, createdAt: '2024-02-11' },
    { key: 'ted', name: 'TED Talks', defaultUrl: 'https://www.ted.com', category: 'learning', clicks: 24, createdAt: '2024-02-12' },
    { key: 'khan', name: 'Khan Academy', defaultUrl: 'https://www.khanacademy.org', category: 'education', clicks: 17, createdAt: '2024-02-13' },
    { key: 'udemy', name: 'Udemy', defaultUrl: 'https://www.udemy.com', category: 'learning', clicks: 21, createdAt: '2024-02-14' },
    { key: 'skillshare', name: 'Skillshare', defaultUrl: 'https://www.skillshare.com', category: 'learning', clicks: 16, createdAt: '2024-02-15' },
    { key: 'codecademy', name: 'Codecademy', defaultUrl: 'https://www.codecademy.com', category: 'technology', clicks: 29, createdAt: '2024-02-16' },
    { key: 'freecodecamp', name: 'freeCodeCamp', defaultUrl: 'https://www.freecodecamp.org', category: 'technology', clicks: 32, createdAt: '2024-02-17' },
    { key: 'asana', name: 'Asana', defaultUrl: 'https://asana.com', category: 'productivity', clicks: 26, createdAt: '2024-02-18' },
    { key: 'monday', name: 'Monday.com', defaultUrl: 'https://monday.com', category: 'business', clicks: 23, createdAt: '2024-02-19' },
    { key: 'salesforce', name: 'Salesforce', defaultUrl: 'https://www.salesforce.com', category: 'business', clicks: 18, createdAt: '2024-02-20' },
    { key: 'hubspot', name: 'HubSpot', defaultUrl: 'https://www.hubspot.com', category: 'business', clicks: 20, createdAt: '2024-02-21' },
    { key: 'mailchimp', name: 'Mailchimp', defaultUrl: 'https://mailchimp.com', category: 'business', clicks: 15, createdAt: '2024-02-22' },
    { key: 'dropbox', name: 'Dropbox', defaultUrl: 'https://www.dropbox.com', category: 'tools', clicks: 27, createdAt: '2024-02-23' },
    { key: 'googledrive', name: 'Google Drive', defaultUrl: 'https://drive.google.com', category: 'tools', clicks: 41, createdAt: '2024-02-24' },
    { key: 'onedrive', name: 'OneDrive', defaultUrl: 'https://onedrive.live.com', category: 'tools', clicks: 19, createdAt: '2024-02-25' },
    { key: 'whatsapp', name: 'WhatsApp Web', defaultUrl: 'https://web.whatsapp.com', category: 'communication', clicks: 55, createdAt: '2024-02-26' },
    { key: 'telegram', name: 'Telegram', defaultUrl: 'https://web.telegram.org', category: 'communication', clicks: 31, createdAt: '2024-02-27' },
    { key: 'teams', name: 'Microsoft Teams', defaultUrl: 'https://teams.microsoft.com', category: 'communication', clicks: 34, createdAt: '2024-02-28' },
    { key: 'twitch', name: 'Twitch', defaultUrl: 'https://www.twitch.tv', category: 'entertainment', clicks: 39, createdAt: '2024-03-01' },
    { key: 'tiktok', name: 'TikTok', defaultUrl: 'https://www.tiktok.com', category: 'entertainment', clicks: 47, createdAt: '2024-03-02' },
    { key: 'reddit', name: 'Reddit', defaultUrl: 'https://www.reddit.com', category: 'social', clicks: 43, createdAt: '2024-03-03' },
    { key: 'quora', name: 'Quora', defaultUrl: 'https://www.quora.com', category: 'education', clicks: 14, createdAt: '2024-03-04' },
    { key: 'stackoverflow', name: 'Stack Overflow', defaultUrl: 'https://stackoverflow.com', category: 'technology', clicks: 36, createdAt: '2024-03-05' },
    { key: 'codepen', name: 'CodePen', defaultUrl: 'https://codepen.io', category: 'technology', clicks: 25, createdAt: '2024-03-06' },
    { key: 'jsfiddle', name: 'JSFiddle', defaultUrl: 'https://jsfiddle.net', category: 'technology', clicks: 18, createdAt: '2024-03-07' },
    { key: 'replit', name: 'Replit', defaultUrl: 'https://replit.com', category: 'technology', clicks: 22, createdAt: '2024-03-08' },
    { key: 'glitch', name: 'Glitch', defaultUrl: 'https://glitch.com', category: 'technology', clicks: 16, createdAt: '2024-03-09' },
    { key: 'vercel', name: 'Vercel', defaultUrl: 'https://vercel.com', category: 'technology', clicks: 21, createdAt: '2024-03-10' },
    { key: 'netlify', name: 'Netlify', defaultUrl: 'https://www.netlify.com', category: 'technology', clicks: 19, createdAt: '2024-03-11' },
    { key: 'heroku', name: 'Heroku', defaultUrl: 'https://www.heroku.com', category: 'technology', clicks: 17, createdAt: '2024-03-12' },
    { key: 'aws', name: 'AWS Console', defaultUrl: 'https://aws.amazon.com', category: 'technology', clicks: 24, createdAt: '2024-03-13' },
    { key: 'azure', name: 'Microsoft Azure', defaultUrl: 'https://portal.azure.com', category: 'technology', clicks: 20, createdAt: '2024-03-14' },
    { key: 'gcp', name: 'Google Cloud', defaultUrl: 'https://console.cloud.google.com', category: 'technology', clicks: 18, createdAt: '2024-03-15' },
    { key: 'digitalocean', name: 'DigitalOcean', defaultUrl: 'https://www.digitalocean.com', category: 'technology', clicks: 15, createdAt: '2024-03-16' },
    { key: 'linode', name: 'Linode', defaultUrl: 'https://www.linode.com', category: 'technology', clicks: 12, createdAt: '2024-03-17' },
    { key: 'vultr', name: 'Vultr', defaultUrl: 'https://www.vultr.com', category: 'technology', clicks: 11, createdAt: '2024-03-18' },
    { key: 'cloudflare', name: 'Cloudflare', defaultUrl: 'https://www.cloudflare.com', category: 'technology', clicks: 23, createdAt: '2024-03-19' },
    { key: 'namecheap', name: 'Namecheap', defaultUrl: 'https://www.namecheap.com', category: 'technology', clicks: 13, createdAt: '2024-03-20' },
    { key: 'godaddy', name: 'GoDaddy', defaultUrl: 'https://www.godaddy.com', category: 'technology', clicks: 14, createdAt: '2024-03-21' },
    { key: 'paypal', name: 'PayPal', defaultUrl: 'https://www.paypal.com', category: 'finance', clicks: 37, createdAt: '2024-03-22' },
    { key: 'stripe', name: 'Stripe', defaultUrl: 'https://stripe.com', category: 'finance', clicks: 26, createdAt: '2024-03-23' },
    { key: 'square', name: 'Square', defaultUrl: 'https://squareup.com', category: 'finance', clicks: 19, createdAt: '2024-03-24' },
    { key: 'mint', name: 'Mint', defaultUrl: 'https://mint.intuit.com', category: 'finance', clicks: 22, createdAt: '2024-03-25' },
    { key: 'quickbooks', name: 'QuickBooks', defaultUrl: 'https://quickbooks.intuit.com', category: 'finance', clicks: 18, createdAt: '2024-03-26' },
    { key: 'robinhood', name: 'Robinhood', defaultUrl: 'https://robinhood.com', category: 'investing', clicks: 28, createdAt: '2024-03-27' },
    { key: 'etrade', name: 'E*TRADE', defaultUrl: 'https://us.etrade.com', category: 'investing', clicks: 21, createdAt: '2024-03-28' },
    { key: 'fidelity', name: 'Fidelity', defaultUrl: 'https://www.fidelity.com', category: 'investing', clicks: 24, createdAt: '2024-03-29' },
    { key: 'schwab', name: 'Charles Schwab', defaultUrl: 'https://www.schwab.com', category: 'investing', clicks: 20, createdAt: '2024-03-30' },
    { key: 'vanguard', name: 'Vanguard', defaultUrl: 'https://investor.vanguard.com', category: 'investing', clicks: 19, createdAt: '2024-03-31' },
    { key: 'binance', name: 'Binance', defaultUrl: 'https://www.binance.com', category: 'cryptocurrency', clicks: 25, createdAt: '2024-04-01' },
    { key: 'kraken', name: 'Kraken', defaultUrl: 'https://www.kraken.com', category: 'cryptocurrency', clicks: 17, createdAt: '2024-04-02' },
    { key: 'gemini', name: 'Gemini', defaultUrl: 'https://www.gemini.com', category: 'cryptocurrency', clicks: 15, createdAt: '2024-04-03' },
    { key: 'coinmarketcap', name: 'CoinMarketCap', defaultUrl: 'https://coinmarketcap.com', category: 'cryptocurrency', clicks: 22, createdAt: '2024-04-04' },
    { key: 'coingecko', name: 'CoinGecko', defaultUrl: 'https://www.coingecko.com', category: 'cryptocurrency', clicks: 18, createdAt: '2024-04-05' },
    { key: 'freelancer', name: 'Freelancer', defaultUrl: 'https://www.freelancer.com', category: 'freelance', clicks: 16, createdAt: '2024-04-06' },
    { key: 'fiverr', name: 'Fiverr', defaultUrl: 'https://www.fiverr.com', category: 'freelance', clicks: 23, createdAt: '2024-04-07' },
    { key: 'guru', name: 'Guru', defaultUrl: 'https://www.guru.com', category: 'freelance', clicks: 12, createdAt: '2024-04-08' },
    { key: '99designs', name: '99designs', defaultUrl: 'https://99designs.com', category: 'freelance', clicks: 14, createdAt: '2024-04-09' },
    { key: 'toptal', name: 'Toptal', defaultUrl: 'https://www.toptal.com', category: 'freelance', clicks: 18, createdAt: '2024-04-10' },
    { key: 'indeed', name: 'Indeed', defaultUrl: 'https://www.indeed.com', category: 'freelance', clicks: 31, createdAt: '2024-04-11' },
    { key: 'glassdoor', name: 'Glassdoor', defaultUrl: 'https://www.glassdoor.com', category: 'freelance', clicks: 26, createdAt: '2024-04-12' },
    { key: 'monster', name: 'Monster', defaultUrl: 'https://www.monster.com', category: 'freelance', clicks: 19, createdAt: '2024-04-13' },
    { key: 'ziprecruiter', name: 'ZipRecruiter', defaultUrl: 'https://www.ziprecruiter.com', category: 'freelance', clicks: 22, createdAt: '2024-04-14' },
    { key: 'careerbuilder', name: 'CareerBuilder', defaultUrl: 'https://www.careerbuilder.com', category: 'freelance', clicks: 17, createdAt: '2024-04-15' },
    { key: 'babbel', name: 'Babbel', defaultUrl: 'https://www.babbel.com', category: 'languages', clicks: 20, createdAt: '2024-04-16' },
    { key: 'rosetta', name: 'Rosetta Stone', defaultUrl: 'https://www.rosettastone.com', category: 'languages', clicks: 18, createdAt: '2024-04-17' },
    { key: 'busuu', name: 'Busuu', defaultUrl: 'https://www.busuu.com', category: 'languages', clicks: 15, createdAt: '2024-04-18' },
    { key: 'memrise', name: 'Memrise', defaultUrl: 'https://www.memrise.com', category: 'languages', clicks: 16, createdAt: '2024-04-19' },
    { key: 'lingoda', name: 'Lingoda', defaultUrl: 'https://www.lingoda.com', category: 'languages', clicks: 13, createdAt: '2024-04-20' },
    { key: 'headspace', name: 'Headspace', defaultUrl: 'https://www.headspace.com', category: 'meditation', clicks: 24, createdAt: '2024-04-21' },
    { key: 'calm', name: 'Calm', defaultUrl: 'https://www.calm.com', category: 'meditation', clicks: 27, createdAt: '2024-04-22' },
    { key: 'insight', name: 'Insight Timer', defaultUrl: 'https://insighttimer.com', category: 'meditation', clicks: 19, createdAt: '2024-04-23' },
    { key: 'ten', name: 'Ten Percent Happier', defaultUrl: 'https://www.tenpercent.com', category: 'meditation', clicks: 16, createdAt: '2024-04-24' },
    { key: 'waking', name: 'Waking Up', defaultUrl: 'https://www.wakingup.com', category: 'meditation', clicks: 14, createdAt: '2024-04-25' },
    { key: 'match', name: 'Match.com', defaultUrl: 'https://www.match.com', category: 'dating', clicks: 21, createdAt: '2024-04-26' },
    { key: 'eharmony', name: 'eHarmony', defaultUrl: 'https://www.eharmony.com', category: 'dating', clicks: 18, createdAt: '2024-04-27' },
    { key: 'bumble', name: 'Bumble', defaultUrl: 'https://bumble.com', category: 'dating', clicks: 25, createdAt: '2024-04-28' },
    { key: 'tinder', name: 'Tinder', defaultUrl: 'https://tinder.com', category: 'dating', clicks: 29, createdAt: '2024-04-29' },
    { key: 'hinge', name: 'Hinge', defaultUrl: 'https://hinge.co', category: 'dating', clicks: 22, createdAt: '2024-04-30' },
    { key: 'babycenter', name: 'BabyCenter', defaultUrl: 'https://www.babycenter.com', category: 'parenting', clicks: 17, createdAt: '2024-05-01' },
    { key: 'whattoexpect', name: 'What to Expect', defaultUrl: 'https://www.whattoexpect.com', category: 'parenting', clicks: 15, createdAt: '2024-05-02' },
    { key: 'parents', name: 'Parents.com', defaultUrl: 'https://www.parents.com', category: 'parenting', clicks: 19, createdAt: '2024-05-03' },
    { key: 'familyeducation', name: 'FamilyEducation', defaultUrl: 'https://www.familyeducation.com', category: 'parenting', clicks: 13, createdAt: '2024-05-04' },
    { key: 'care', name: 'Care.com', defaultUrl: 'https://www.care.com', category: 'parenting', clicks: 21, createdAt: '2024-05-05' },
    { key: 'aarp', name: 'AARP', defaultUrl: 'https://www.aarp.org', category: 'seniors', clicks: 16, createdAt: '2024-05-06' },
    { key: 'seniorplanet', name: 'Senior Planet', defaultUrl: 'https://seniorplanet.org', category: 'seniors', clicks: 12, createdAt: '2024-05-07' },
    { key: 'medicare', name: 'Medicare.gov', defaultUrl: 'https://www.medicare.gov', category: 'seniors', clicks: 18, createdAt: '2024-05-08' },
    { key: 'socialsecurity', name: 'Social Security', defaultUrl: 'https://www.ssa.gov', category: 'seniors', clicks: 20, createdAt: '2024-05-09' },
    { key: 'seniorliving', name: 'SeniorLiving.org', defaultUrl: 'https://www.seniorliving.org', category: 'seniors', clicks: 14, createdAt: '2024-05-10' },
    { key: 'pbskids', name: 'PBS Kids', defaultUrl: 'https://pbskids.org', category: 'kids', clicks: 23, createdAt: '2024-05-11' },
    { key: 'nickjr', name: 'Nick Jr.', defaultUrl: 'https://www.nickjr.com', category: 'kids', clicks: 21, createdAt: '2024-05-12' },
    { key: 'disney', name: 'Disney+', defaultUrl: 'https://www.disneyplus.com', category: 'kids', clicks: 35, createdAt: '2024-05-13' },
    { key: 'sesamestreet', name: 'Sesame Street', defaultUrl: 'https://www.sesamestreet.org', category: 'kids', clicks: 18, createdAt: '2024-05-14' },
    { key: 'funbrain', name: 'Funbrain', defaultUrl: 'https://www.funbrain.com', category: 'kids', clicks: 16, createdAt: '2024-05-15' },
    { key: 'yelp', name: 'Yelp', defaultUrl: 'https://www.yelp.com', category: 'local', clicks: 32, createdAt: '2024-05-16' },
    { key: 'foursquare', name: 'Foursquare', defaultUrl: 'https://foursquare.com', category: 'local', clicks: 14, createdAt: '2024-05-17' },
    { key: 'nextdoor', name: 'Nextdoor', defaultUrl: 'https://nextdoor.com', category: 'local', clicks: 19, createdAt: '2024-05-18' },
    { key: 'angie', name: 'Angie\'s List', defaultUrl: 'https://www.angi.com', category: 'local', clicks: 17, createdAt: '2024-05-19' },
    { key: 'thumbtack', name: 'Thumbtack', defaultUrl: 'https://www.thumbtack.com', category: 'local', clicks: 22, createdAt: '2024-05-20' },
    { key: 'pge', name: 'PG&E', defaultUrl: 'https://www.pge.com', category: 'utilities', clicks: 15, createdAt: '2024-05-21' },
    { key: 'edison', name: 'Southern California Edison', defaultUrl: 'https://www.sce.com', category: 'utilities', clicks: 13, createdAt: '2024-05-22' },
    { key: 'verizon', name: 'Verizon', defaultUrl: 'https://www.verizon.com', category: 'utilities', clicks: 24, createdAt: '2024-05-23' },
    { key: 'att', name: 'AT&T', defaultUrl: 'https://www.att.com', category: 'utilities', clicks: 22, createdAt: '2024-05-24' },
    { key: 'tmobile', name: 'T-Mobile', defaultUrl: 'https://www.t-mobile.com', category: 'utilities', clicks: 20, createdAt: '2024-05-25' },
    { key: 'lastpass', name: 'LastPass', defaultUrl: 'https://www.lastpass.com', category: 'security', clicks: 26, createdAt: '2024-05-26' },
    { key: 'onepassword', name: '1Password', defaultUrl: 'https://1password.com', category: 'security', clicks: 23, createdAt: '2024-05-27' },
    { key: 'bitwarden', name: 'Bitwarden', defaultUrl: 'https://bitwarden.com', category: 'security', clicks: 21, createdAt: '2024-05-28' },
    { key: 'dashlane', name: 'Dashlane', defaultUrl: 'https://www.dashlane.com', category: 'security', clicks: 18, createdAt: '2024-05-29' },
    { key: 'nordvpn', name: 'NordVPN', defaultUrl: 'https://nordvpn.com', category: 'security', clicks: 25, createdAt: '2024-05-30' },
  ]);

  const categoryLabels = {
    ai: 'AI & Tech',
    shopping: 'Shopping',
    social: 'Social Media',
    news: 'News',
    streaming: 'Streaming',
    tools: 'Tools',
    finance: 'Finance',
    gaming: 'Gaming',
    travel: 'Travel',
    food: 'Food & Dining',
    education: 'Education',
    services: 'Services',
    health: 'Health & Fitness',
    sports: 'Sports',
    music: 'Music',
    photography: 'Photography',
    design: 'Design',
    productivity: 'Productivity',
    communication: 'Communication',
    entertainment: 'Entertainment',
    business: 'Business',
    technology: 'Technology',
    science: 'Science',
    art: 'Art & Culture',
    books: 'Books & Reading',
    cooking: 'Cooking & Recipes',
    diy: 'DIY & Crafts',
    pets: 'Pets & Animals',
    automotive: 'Automotive',
    real_estate: 'Real Estate',
    fashion: 'Fashion & Style',
    weather: 'Weather',
    maps: 'Maps & Navigation',
    government: 'Government',
    legal: 'Legal',
    insurance: 'Insurance',
    banking: 'Banking',
    investing: 'Investing',
    cryptocurrency: 'Cryptocurrency',
    freelance: 'Freelance & Jobs',
    learning: 'Online Learning',
    languages: 'Languages',
    meditation: 'Meditation & Wellness',
    dating: 'Dating & Relationships',
    parenting: 'Parenting',
    seniors: 'Seniors',
    kids: 'Kids & Family',
    local: 'Local Services',
    utilities: 'Utilities',
    security: 'Security & Privacy',
    custom: 'Custom Links'
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

  const openModal = (link?: LinkData) => {
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
        category: 'custom',
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
    if (draggedItem) {
      setLinksData(prev => prev.map(link => 
        link.key === draggedItem ? { ...link, category: targetCategory } : link
      ));
      setDraggedItem(null);
      toast.success('Link moved to new category!');
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
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
      }`}>
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
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
    }`}>
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
          />
        ))}

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
