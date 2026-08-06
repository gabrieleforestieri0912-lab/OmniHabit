import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['.next', 'node_modules']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'no-unused-vars': ['warn', { 
        'varsIgnorePattern': '^(React|motion|AnimatePresence|PieChart|Pie|Cell|ResponsiveContainer|RechartsTooltip|Plus|Trash2|CheckCircle2|Circle|ChevronRight|BookOpen|Brain|TrendingUp|Zap|Calendar|X|LayoutGrid|Menu|LogIn|LogOut|ShieldCheck|Trophy|Target|ArrowLeft|Loader2|Check|Sparkles|Bot|MessageCircle|MessageSquare|Send|ChevronDown|Clock|Star|ArrowRight|ArrowUp|Heart|Flame|LineChart|Activity|Award|BarChart3|Settings|User|LayoutDashboard|HelpCircle|Footer|Navbar|HeroSection|MonthSelection|DocAccessSection|MonthDashboard|UserDashboard|AuthModal|ChatModal|ChatPage|PlanModal|DocPage|FeaturesSection|FAQSection|AIAssistantSection|PricingSection|PlansPage|Save|Play|Pause|XCircle|Reveal|ScrollVideo|SectionOne|SectionTwo)$',
        'argsIgnorePattern': '^_'
      }],
    },
  },
]);
