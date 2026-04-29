# 🏗️ Rewire Frontend Refactoring - Complete Phase Plan

---

## ✅ Phase 1: Foundation & Code Organization (COMPLETE)

**Duration**: Day 1-2  
**Status**: ✅ Complete

### Completed:
- ✅ Created `types/index.ts` - All TypeScript definitions
- ✅ Created `constants/index.ts` - App-wide constants
- ✅ Created `utils/index.ts` - Utility functions
- ✅ Created `utils/errorHandler.ts` - Error handling
- ✅ Created `services/api.ts` - API service layer
- ✅ Migrated AuthContext to use new API service
- ✅ Migrated useChallenge hook to use new API service
- ✅ Updated ChallengeCard to use utilities

### Benefits:
- Full TypeScript coverage
- Single source of truth for API calls
- Consistent error handling
- Reusable utility functions

---

## 🔄 Phase 2: Component Optimization (IN PROGRESS)

**Duration**: Day 3-4  
**Status**: 🔄 In Progress

### Created Components:
- ✅ `StatCard` - Reusable stat display card
- ✅ `Spinner` - Loading spinner with sizes
- ✅ `PageLoader` - Full page loading state
- ✅ `EmptyState` - Empty state with icon and action

### Next Tasks:
- [ ] Add React.memo to expensive components
- [ ] Refactor DashboardPage to use StatCard
- [ ] Refactor ProgressPage to use new components
- [ ] Refactor ChallengesPage to use new components
- [ ] Extract repeated patterns into components

---

## 📋 Phase 3: State Management

**Duration**: Day 5-6  
**Status**: ⏳ Pending

### Tasks:
1. Install React Query
   ```bash
   npm install @tanstack/react-query
   ```

2. Setup Query Client
   ```typescript
   // frontend/src/main.tsx
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   
   const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 5 * 60 * 1000, // 5 minutes
         retry: 1,
       },
     },
   });
   ```

3. Create Query Hooks
   - `useHistoryQuery` - Challenge history with caching
   - `useStatsQuery` - User stats with caching
   - `useInsightsQuery` - Insights with caching
   - `useAchievementsQuery` - Achievements with caching

4. Add Mutations
   - `useCompleteChallengeMutation` - Optimistic updates
   - `useUpdateProfileMutation` - Profile updates

### Benefits:
- Automatic caching and refetching
- Optimistic updates
- Loading and error states handled
- Reduced API calls

---

## ♿ Phase 4: Accessibility & UX

**Duration**: Day 7-8  
**Status**: ⏳ Pending

### Tasks:
1. **ARIA Attributes**
   - Add role="tablist" to tab components
   - Add aria-selected to active tabs
   - Add aria-label to icon buttons
   - Add aria-live for dynamic content

2. **Keyboard Navigation**
   - Escape key closes modals
   - Tab navigation works correctly
   - Enter/Space activates buttons
   - Arrow keys for tab navigation

3. **Focus Management**
   - Visible focus indicators
   - Focus trap in modals
   - Focus restoration after modal close
   - Skip links for main content

4. **Screen Reader Support**
   - Meaningful alt text for images
   - Hidden labels for icon-only buttons
   - Status announcements for actions
   - Proper heading hierarchy

5. **Color Contrast**
   - Verify all text meets WCAG AA
   - Test with contrast checker
   - Adjust muted colors if needed

### Tools:
- axe DevTools for automated testing
- NVDA/JAWS for screen reader testing
- Keyboard-only navigation testing

---

## ⚡ Phase 5: Performance Optimization

**Duration**: Day 9-10  
**Status**: ⏳ Pending

### Tasks:
1. **Code Splitting**
   ```typescript
   // Lazy load routes
   const DashboardPage = lazy(() => import('./pages/DashboardPage'));
   const ProgressPage = lazy(() => import('./pages/ProgressPage'));
   
   // Lazy load heavy libraries
   const LineChart = lazy(() => import('recharts').then(m => ({ default: m.LineChart })));
   ```

2. **Memoization**
   - Add React.memo to pure components
   - Use useMemo for expensive calculations
   - Use useCallback for event handlers
   - Memoize calendar data generation

3. **Image Optimization**
   - Add lazy loading to images
   - Use responsive image sizes
   - Optimize image formats (WebP)
   - Add loading="lazy" attribute

4. **Bundle Optimization**
   - Analyze bundle size with vite-bundle-visualizer
   - Tree-shake unused code
   - Consider lighter alternatives to heavy libraries
   - Split vendor chunks

5. **Virtualization**
   - Add react-window for long lists (challenge history)
   - Virtualize achievement grids if > 50 items

### Metrics to Track:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Bundle size

---

## 🧪 Phase 6: Testing Infrastructure

**Duration**: Day 11-12  
**Status**: ⏳ Pending

### Setup:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Test Structure:
```
frontend/src/
├── __tests__/
│   ├── integration/
│   │   └── auth-flow.test.tsx
│   └── setup.ts
├── components/
│   └── __tests__/
│       ├── ChallengeCard.test.tsx
│       └── StatCard.test.tsx
├── utils/
│   └── __tests__/
│       ├── index.test.ts
│       └── errorHandler.test.ts
└── services/
    └── __tests__/
        └── api.test.ts
```

### Test Coverage Goals:
- Utils: 90%+ coverage
- Components: 80%+ coverage
- Services: 85%+ coverage
- Integration: Key user flows

### Tests to Write:
1. **Unit Tests**
   - Utility functions (formatTime, getCategoryColor, etc.)
   - Error handler functions
   - Data processing functions

2. **Component Tests**
   - ChallengeCard renders correctly
   - StatCard displays data
   - Spinner shows loading state
   - EmptyState shows message

3. **Integration Tests**
   - Login flow
   - Challenge completion flow
   - Navigation between pages
   - Error handling

4. **E2E Tests** (Optional - Playwright)
   - Full user journey
   - Cross-browser testing

---

## 📊 Success Metrics

### Code Quality:
- ✅ TypeScript strict mode enabled
- ✅ No `any` types
- ✅ ESLint passing
- ✅ Prettier formatting

### Performance:
- Bundle size < 500KB (gzipped)
- FCP < 1.5s
- LCP < 2.5s
- TTI < 3.5s

### Accessibility:
- WCAG 2.1 AA compliant
- Keyboard navigable
- Screen reader friendly
- Color contrast passing

### Testing:
- 80%+ code coverage
- All critical paths tested
- No failing tests
- CI/CD integration

---

## 🎯 Current Status Summary

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Foundation | ✅ Complete | 100% |
| Phase 2: Components | 🔄 In Progress | 40% |
| Phase 3: State Management | ⏳ Pending | 0% |
| Phase 4: Accessibility | ⏳ Pending | 0% |
| Phase 5: Performance | ⏳ Pending | 0% |
| Phase 6: Testing | ⏳ Pending | 0% |

---

## 🚀 Next Immediate Steps

1. ✅ Complete Phase 2 component creation
2. Refactor DashboardPage to use new components
3. Refactor ProgressPage to use new components
4. Add React.memo to components
5. Test all changes work correctly

---

## 📝 Notes

- Each phase builds on the previous one
- Can parallelize some tasks (e.g., accessibility + performance)
- Testing should be ongoing, not just Phase 6
- Document breaking changes and migration guides
- Keep user experience smooth during refactoring
