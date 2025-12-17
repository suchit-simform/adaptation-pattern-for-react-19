# Implementation Tasks - Product Detail Page

**Project**: React 18 Ecommerce Product Detail Page  
**Status**: ✅ Complete  
**Created**: December 17, 2025  
**Completed**: December 17, 2025

---

## Task Breakdown

### Phase 1: Project Foundation (Estimated: 4 hours)

#### Task 1.1: Setup Type Definitions

**Priority**: High | **Estimated Time**: 1 hour

- [x] Create `src/types/product.ts`
  - [ ] Define `Product` interface
  - [ ] Define `ProductImage` interface
- [x] Create `src/types/cart.ts`
  - [ ] Define `Cart` interface
  - [ ] Define `CartItem` interface
- [x] Create `src/types/api.ts`
  - [ ] Define `ApiResponse<T>` generic interface
  - [ ] Define `ApiError` interface with error codes
- [x] Verify TypeScript compilation with no errors

**Acceptance Criteria:**

- All types exported correctly
- No TypeScript errors
- Types match specification document

---

#### Task 1.2: Create Mock Product Data

**Priority**: High | **Estimated Time**: 1 hour

- [x] Create `src/data/` directory
- [x] Create `src/data/products.json`
  - [ ] Add at least 2 product entries
  - [ ] Include all required fields (id, name, price, stock, etc.)
  - [ ] Reference image paths in `/products/` directory
- [x] Verify JSON is valid
- [x] Add TypeScript declaration for JSON imports in `vite-env.d.ts`

**Acceptance Criteria:**

- JSON file is valid and parseable
- Product data includes all required fields
- Images paths are correct

---

#### Task 1.3: Setup Placeholder Images

**Priority**: Medium | **Estimated Time**: 30 minutes

- [x] Create `public/products/` directory
- [x] Add placeholder images:
  - [ ] `product-1.jpg` (main image)
  - [ ] `product-1-thumb.jpg` (thumbnail)
  - [ ] `product-2.jpg` (main image)
  - [ ] `product-2-thumb.jpg` (thumbnail)
- [x] Verify images are accessible via browser

**Acceptance Criteria:**

- Images load correctly in browser at `/products/product-1.jpg`
- All referenced images exist
- Images are reasonable size (< 500KB each)

---

#### Task 1.4: Verify Project Dependencies

**Priority**: High | **Estimated Time**: 30 minutes

- [x] Review `package.json` dependencies
- [x] Ensure only minimal dependencies are installed:
  - [ ] react ^18.2.0
  - [ ] react-dom ^18.2.0
  - [ ] TypeScript
  - [ ] Vite
  - [ ] Testing libraries (vitest, @testing-library/react)
- [x] Run `pnpm install` if needed
- [x] Verify dev server runs: `pnpm run dev`

**Acceptance Criteria:**

- No unnecessary dependencies
- Project builds without errors
- Dev server starts successfully

---

### Phase 2: Mock API Layer (Estimated: 6 hours)

#### Task 2.1: Create Mock API Utility

**Priority**: High | **Estimated Time**: 2 hours

- [x] Create `src/api/mockApi.ts`
- [x] Implement `MockApi` class
  - [ ] Constructor with delay and failure rate parameters
  - [ ] `request<T>()` method with simulated delay
  - [ ] Random failure simulation
- [x] Implement `MemoryDB` class
  - [ ] In-memory inventory Map storage
  - [ ] In-memory cart Map storage
  - [ ] Version tracking for optimistic locking
  - [ ] `initializeInventory()` method
  - [ ] `getStock()` method
  - [ ] `getVersion()` method
  - [ ] `decrementStock()` with atomic operation
  - [ ] `getCart()` and `setCart()` methods
- [x] Export singleton instances: `db`, `mockApi`
- [x] Write unit tests for MemoryDB

**Acceptance Criteria:**

- Mock API simulates network delay (500ms)
- Optimistic locking prevents race conditions
- All methods work correctly
- Tests pass with 100% coverage

---

#### Task 2.2: Create Product API Client

**Priority**: High | **Estimated Time**: 2 hours

- [x] Create `src/api/productApi.ts`
- [x] Import products data and initialize inventory
- [x] Implement `getProduct(id: string)` function
  - [ ] Use mockApi.request wrapper
  - [ ] Return product with current stock from DB
  - [ ] Handle product not found error
- [x] Implement `getAllProducts()` function
  - [ ] Return all products with current stock
- [x] Write unit tests for both functions
- [x] Test error scenarios

**Acceptance Criteria:**

- Product fetch returns correct data
- Stock values reflect DB state
- Error handling works correctly
- Tests pass

---

#### Task 2.3: Create Cart API Client

**Priority**: High | **Estimated Time**: 2 hours

- [x] Create `src/api/cartApi.ts`
- [x] Implement `addToCartApi(request)` function
  - [ ] Validate input (productId, quantity)
  - [ ] Check product exists
  - [ ] Validate max quantity per order
  - [ ] Check stock availability
  - [ ] Perform atomic stock decrement with optimistic locking
  - [ ] Update cart (add new or update existing item)
  - [ ] Return success with updated cart
  - [ ] Handle all error scenarios (OUT_OF_STOCK, INVALID_QUANTITY, etc.)
- [x] Implement `getCart()` function
  - [ ] Return current cart state
- [x] Write comprehensive unit tests
  - [ ] Test successful add
  - [ ] Test out of stock
  - [ ] Test concurrent requests
  - [ ] Test validation errors

**Acceptance Criteria:**

- Add to cart prevents overselling
- Concurrent requests handled correctly
- All error codes returned properly
- Tests cover all edge cases
- 90%+ code coverage

---

### Phase 3: Utilities & Custom Hooks (Estimated: 4 hours)

#### Task 3.1: Create Utility Functions

**Priority**: Medium | **Estimated Time**: 1 hour

- [x] Create `src/utils/formatPrice.ts`
  - [ ] Implement `formatPrice(price, currency)` function
  - [ ] Support USD, EUR, GBP
  - [ ] Add unit tests
- [x] Create `src/utils/storage.ts`
  - [ ] Implement `getFromStorage<T>(key, defaultValue)` with error handling
  - [ ] Implement `setToStorage<T>(key, value)` with error handling
  - [ ] Implement `removeFromStorage(key)`
  - [ ] Add unit tests with localStorage mocking
- [x] Create `src/utils/validation.ts`
  - [ ] Implement `validateQuantity(quantity, stock, maxQuantity)`
  - [ ] Return validation result with error message
  - [ ] Add unit tests for all validation scenarios

**Acceptance Criteria:**

- All utilities work correctly
- Error handling is robust
- Tests pass with good coverage

---

#### Task 3.2: Create Custom Hooks

**Priority**: High | **Estimated Time**: 3 hours

- [x] Create `src/hooks/useOptimisticUpdate.ts`
  - [ ] Implement hook with generic type parameter
  - [ ] Track optimistic value and isOptimistic state
  - [ ] Implement `startOptimisticUpdate(newValue)`
  - [ ] Implement `confirmUpdate()`
  - [ ] Implement `revertUpdate()`
  - [ ] Store previous value for revert
  - [ ] Add unit tests with React Testing Library
- [x] Create `src/hooks/useLocalStorage.ts`
  - [ ] Implement hook with generic type
  - [ ] Initialize from localStorage
  - [ ] Sync to localStorage on change
  - [ ] Handle JSON parse errors
  - [ ] Add unit tests
- [x] Create `src/hooks/useAsync.ts`
  - [ ] Track data, error, isLoading state
  - [ ] Implement `execute(asyncFunction)` method
  - [ ] Handle loading states properly
  - [ ] Add unit tests for success and error scenarios

**Acceptance Criteria:**

- All hooks work with TypeScript generics
- State updates correctly
- Tests demonstrate hook behavior
- No memory leaks

---

### Phase 4: Context Providers (Estimated: 3 hours)

#### Task 4.1: Create Cart Context

**Priority**: High | **Estimated Time**: 3 hours

- [x] Create `src/context/CartContext.tsx`
- [x] Define `CartContextValue` interface
  - [ ] cart: Cart | null
  - [ ] isLoading: boolean
  - [ ] itemCount: number (computed)
  - [ ] totalAmount: number (computed)
  - [ ] updateCart: (cart: Cart) => void
  - [ ] syncWithServer: () => Promise<void>
- [x] Implement `CartProvider` component
  - [ ] Use useState for cart and loading state
  - [ ] Implement updateCart callback
  - [ ] Implement syncWithServer with getCart API
  - [ ] Load cart on mount (useEffect)
  - [ ] Calculate itemCount and totalAmount
  - [ ] Provide context value
- [x] Implement `useCart()` hook
  - [ ] Verify context exists
  - [ ] Return context value
- [x] Write integration tests
  - [ ] Test provider renders children
  - [ ] Test cart updates
  - [ ] Test computed values
  - [ ] Test error handling

**Acceptance Criteria:**

- Context provides all required values
- Cart syncs from server on mount
- Computed values are correct
- Hook throws error outside provider
- Tests pass

---

### Phase 5: UI Components (Estimated: 12 hours)

#### Task 5.1: Create StockIndicator Component

**Priority**: Medium | **Estimated Time**: 1.5 hours

- [x] Create `src/components/ProductDetail/StockIndicator.tsx`
- [x] Create `src/components/ProductDetail/StockIndicator.css`
- [x] Implement component logic
  - [ ] Accept stock and threshold props
  - [ ] Show different states: out-of-stock, critical, low, in-stock
  - [ ] Use appropriate icons and colors
  - [ ] Include role="status" for accessibility
- [x] Style component
  - [ ] Different colors for each state
  - [ ] Pulse animation for critical stock
  - [ ] Responsive design
- [x] Write component tests
  - [ ] Test all stock states
  - [ ] Test custom thresholds
  - [ ] Test accessibility

**Acceptance Criteria:**

- Component renders all states correctly
- Visual feedback is clear
- Accessible to screen readers
- Tests cover all states

---

#### Task 5.2: Create ProductImage Component

**Priority**: Medium | **Estimated Time**: 2 hours

- [x] Create `src/components/ProductDetail/ProductImage.tsx`
- [x] Create `src/components/ProductDetail/ProductImage.css`
- [x] Implement component logic
  - [ ] Display primary image initially
  - [ ] Show loading skeleton while image loads
  - [ ] Thumbnail gallery for multiple images
  - [ ] Click thumbnail to change main image
  - [ ] Keyboard navigation support
- [x] Style component
  - [ ] Responsive image container (aspect-ratio: 1)
  - [ ] Skeleton loading animation
  - [ ] Thumbnail grid with hover effects
  - [ ] Active thumbnail highlight
  - [ ] Mobile-friendly sizes
- [x] Write component tests
  - [ ] Test image selection
  - [ ] Test loading state
  - [ ] Test keyboard navigation
  - [ ] Test accessibility

**Acceptance Criteria:**

- Images load with skeleton
- Thumbnail selection works
- Keyboard accessible
- Responsive on mobile
- Tests pass

---

#### Task 5.3: Create ProductInfo Component

**Priority**: Medium | **Estimated Time**: 1.5 hours

- [x] Create `src/components/ProductDetail/ProductInfo.tsx`
- [x] Create `src/components/ProductDetail/ProductInfo.css`
- [x] Implement component logic
  - [ ] Display product name (H1)
  - [ ] Display SKU
  - [ ] Display rating with stars (if available)
  - [ ] Display formatted price
  - [ ] Display description
  - [ ] Use formatPrice utility
- [x] Style component
  - [ ] Clear typography hierarchy
  - [ ] Prominent price display
  - [ ] Readable description
  - [ ] Responsive font sizes
- [x] Write component tests
  - [ ] Test all fields render
  - [ ] Test price formatting
  - [ ] Test optional rating

**Acceptance Criteria:**

- All product info displays correctly
- Price formatted properly
- Responsive typography
- Tests pass

---

#### Task 5.4: Create AddToCartButton Component

**Priority**: High | **Estimated Time**: 3 hours

- [x] Create `src/components/ProductDetail/AddToCartButton.tsx`
- [x] Create `src/components/ProductDetail/AddToCartButton.css`
- [x] Implement component logic
  - [ ] Quantity input with validation
  - [ ] Add to cart button
  - [ ] Loading state during API call
  - [ ] Error message display
  - [ ] Success message display (auto-dismiss after 3s)
  - [ ] Use useOptimisticUpdate for stock
  - [ ] Use useCart context for cart updates
  - [ ] Call addToCartApi
  - [ ] Handle all error scenarios
  - [ ] Validate quantity before submit
  - [ ] Disable when out of stock
- [x] Style component
  - [ ] Clean form layout
  - [ ] Prominent CTA button
  - [ ] Loading spinner on button
  - [ ] Error/success message styling
  - [ ] Disabled state styling
  - [ ] Responsive design
- [x] Write component tests
  - [ ] Test successful add to cart
  - [ ] Test validation errors
  - [ ] Test out of stock
  - [ ] Test optimistic update
  - [ ] Test error handling
  - [ ] Test accessibility

**Acceptance Criteria:**

- Quantity validation works
- Optimistic updates correctly
- Errors shown to user
- Success feedback clear
- Accessible and keyboard navigable
- All tests pass

---

#### Task 5.5: Create CartSummary Component

**Priority**: Medium | **Estimated Time**: 1.5 hours

- [x] Create `src/components/Cart/CartSummary.tsx`
- [x] Create `src/components/Cart/CartSummary.css`
- [x] Implement component logic
  - [ ] Use useCart hook
  - [ ] Display cart icon with badge
  - [ ] Show item count in badge
  - [ ] Display total amount
  - [ ] Handle loading state
  - [ ] Badge animation on count change
  - [ ] Aria labels for accessibility
- [x] Style component
  - [ ] Fixed position (top-right)
  - [ ] Badge positioning and styling
  - [ ] Bounce animation for badge
  - [ ] Clean, minimal design
  - [ ] Mobile responsive (hide total on small screens)
- [x] Write component tests
  - [ ] Test cart data display
  - [ ] Test empty cart
  - [ ] Test loading state
  - [ ] Test accessibility

**Acceptance Criteria:**

- Cart summary updates in real-time
- Badge shows correct count
- Accessible labels
- Responsive design
- Tests pass

---

#### Task 5.6: Create ProductDetail Container

**Priority**: High | **Estimated Time**: 2.5 hours

- [x] Create `src/components/ProductDetail/ProductDetail.tsx`
- [x] Create `src/components/ProductDetail/ProductDetail.css`
- [x] Implement component logic
  - [ ] Accept productId prop
  - [ ] Load product data on mount
  - [ ] Track loading and error states
  - [ ] Compose all child components:
    - [ ] ProductImage
    - [ ] ProductInfo
    - [ ] StockIndicator
    - [ ] AddToCartButton
  - [ ] Handle loading state (skeleton)
  - [ ] Handle error state with retry
  - [ ] Use useEffect for data fetching
- [x] Style component
  - [ ] Two-column grid layout (desktop)
  - [ ] Single column on mobile
  - [ ] Sticky image column on scroll
  - [ ] Proper spacing and padding
  - [ ] Skeleton loader styling
  - [ ] Error state styling
- [x] Write integration tests
  - [ ] Test product loads successfully
  - [ ] Test loading state
  - [ ] Test error state
  - [ ] Test retry functionality
  - [ ] Test responsive layout

**Acceptance Criteria:**

- Product data loads correctly
- All child components render
- Loading and error states work
- Responsive layout adapts
- Tests pass

---

#### Task 5.7: Create ErrorBoundary Component

**Priority**: Medium | **Estimated Time**: 1 hour

- [x] Create `src/components/ErrorBoundary/ErrorBoundary.tsx`
- [x] Create `src/components/ErrorBoundary/ErrorBoundary.css`
- [x] Implement class component
  - [ ] Implement getDerivedStateFromError
  - [ ] Implement componentDidCatch with logging
  - [ ] Support custom fallback prop
  - [ ] Default error UI with reload button
- [x] Style component
  - [ ] Centered error message
  - [ ] Clear error text
  - [ ] Prominent reload button
- [x] Write tests
  - [ ] Test error catching
  - [ ] Test fallback rendering
  - [ ] Test custom fallback

**Acceptance Criteria:**

- Catches React errors
- Shows user-friendly message
- Reload functionality works
- Logs errors for debugging
- Tests pass

---

### Phase 6: App Integration (Estimated: 3 hours)

#### Task 6.1: Update App Component

**Priority**: High | **Estimated Time**: 1.5 hours

- [x] Update `src/App.tsx`
- [x] Update `src/App.css`
- [x] Wrap app with providers:
  - [ ] ErrorBoundary (outer)
  - [ ] CartProvider
- [x] Create app layout:
  - [ ] Header with logo and CartSummary
  - [ ] Main content area with ProductDetail
  - [ ] Footer
- [x] Style app structure
  - [ ] Global layout (flex column, min-height: 100vh)
  - [ ] Sticky header
  - [ ] Proper spacing
  - [ ] Footer styling
- [x] Test full app integration
  - [ ] End-to-end user flow
  - [ ] Provider nesting works
  - [ ] Error boundary catches errors

**Acceptance Criteria:**

- App renders without errors
- All providers work together
- Layout is clean and responsive
- Navigation works

---

#### Task 6.2: Update Global Styles

**Priority**: Low | **Estimated Time**: 1 hour

- [x] Update `src/index.css`
- [x] Add CSS reset/normalize
  - [ ] Box-sizing border-box
  - [ ] Remove default margins
- [x] Set base font family
- [x] Add focus-visible styles for accessibility
- [x] Remove focus outline for mouse users
- [x] Ensure consistent input/button fonts
- [x] Test across browsers

**Acceptance Criteria:**

- Consistent styles across browsers
- Accessible focus indicators
- Clean base styles

---

#### Task 6.3: Configure Vite for Testing

**Priority**: Medium | **Estimated Time**: 30 minutes

- [x] Update `vite.config.ts`
- [x] Add vitest configuration
  - [ ] Enable globals
  - [ ] Set environment to 'jsdom'
  - [ ] Point to setup file
- [x] Create `src/test/setup.ts`
  - [ ] Import @testing-library/jest-dom
  - [ ] Mock localStorage
  - [ ] Add any global test utilities
- [x] Verify tests run: `pnpm run test`

**Acceptance Criteria:**

- Test configuration works
- All tests can import testing utilities
- Tests run successfully

---

### Phase 7: Testing & Quality Assurance (Estimated: 8 hours)

#### Task 7.1: Write Unit Tests

**Priority**: High | **Estimated Time**: 4 hours

- [x] Test all utility functions (100% coverage)
- [x] Test all custom hooks
- [x] Test all API clients
- [x] Test mock API and MemoryDB
- [x] Achieve 80%+ overall code coverage
- [x] Fix any failing tests

**Acceptance Criteria:**

- All unit tests pass
- Coverage >= 80%
- No flaky tests

---

#### Task 7.2: Write Component Tests

**Priority**: High | **Estimated Time**: 3 hours

- [x] Test StockIndicator component
- [x] Test ProductImage component
- [x] Test ProductInfo component
- [x] Test AddToCartButton component
- [x] Test CartSummary component
- [x] Test ProductDetail integration
- [x] Test ErrorBoundary
- [x] Achieve 80%+ component coverage

**Acceptance Criteria:**

- All component tests pass
- User interactions tested
- Accessibility tested
- Coverage >= 80%

---

#### Task 7.3: Accessibility Audit

**Priority**: High | **Estimated Time**: 1 hour

- [x] Run automated accessibility tests (jest-axe)
- [x] Test keyboard navigation through entire flow
- [x] Test with screen reader (verify ARIA labels)
- [x] Check color contrast ratios (minimum 4.5:1)
- [x] Verify focus indicators are visible
- [x] Test form validation messages are announced
- [x] Fix any accessibility issues found

**Acceptance Criteria:**

- No automated accessibility violations
- Full keyboard navigation works
- Screen reader announces correctly
- WCAG AA compliant

---

### Phase 8: Polish & Optimization (Estimated: 6 hours)

#### Task 8.1: Performance Optimization

**Priority**: Medium | **Estimated Time**: 2 hours

- [x] Optimize images (compress, use appropriate formats)
- [x] Check bundle size: `pnpm run build`
  - [ ] Ensure < 150KB gzipped
- [x] Add lazy loading for images
- [x] Verify no unnecessary re-renders
- [x] Test on slow network (DevTools throttling)
- [x] Measure Core Web Vitals
  - [ ] LCP < 2.0s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

**Acceptance Criteria:**

- Bundle size within target
- Images optimized
- Performance metrics meet targets
- No console warnings

---

#### Task 8.2: Responsive Design Testing

**Priority**: High | **Estimated Time**: 2 hours

- [x] Test on mobile (< 640px)
  - [ ] Layout works
  - [ ] Touch targets >= 44px
  - [ ] Text readable
- [x] Test on tablet (640-1024px)
- [x] Test on desktop (> 1024px)
- [x] Test landscape and portrait orientations
- [x] Test with browser zoom (200%)
- [x] Fix any layout issues

**Acceptance Criteria:**

- Works on all screen sizes
- No horizontal scroll
- Text scales appropriately
- Touch-friendly on mobile

---

#### Task 8.3: Cross-Browser Testing

**Priority**: Medium | **Estimated Time**: 1 hour

- [x] Test in Chrome/Edge (Chromium)
- [x] Test in Firefox
- [x] Test in Safari
- [x] Fix browser-specific issues
- [x] Verify CSS compatibility
- [x] Test JavaScript features

**Acceptance Criteria:**

- Works consistently across browsers
- No browser-specific bugs
- CSS renders correctly

---

#### Task 8.4: Add Polish & Animations

**Priority**: Low | **Estimated Time**: 1 hour

- [x] Smooth transitions for state changes
- [x] Loading animations (skeleton, spinners)
- [x] Success/error message animations
- [x] Cart badge bounce animation
- [x] Hover effects on interactive elements
- [x] Focus animations
- [x] Ensure animations respect prefers-reduced-motion

**Acceptance Criteria:**

- Animations enhance UX
- No jarring transitions
- Respects user preferences
- Performance not impacted

---

### Phase 9: Documentation & Cleanup (Estimated: 2 hours)

#### Task 9.1: Code Documentation

**Priority**: Low | **Estimated Time**: 1 hour

- [x] Add JSDoc comments to complex functions
- [x] Document component props with TSDoc
- [x] Add inline comments for complex logic
- [x] Update README.md
  - [ ] Project description
  - [ ] Setup instructions
  - [ ] Available scripts
  - [ ] Project structure
  - [ ] Technologies used

**Acceptance Criteria:**

- Code is well-documented
- README is comprehensive
- New developers can onboard easily

---

#### Task 9.2: Final Cleanup

**Priority**: Low | **Estimated Time**: 1 hour

- [x] Remove console.logs (keep only error logs)
- [x] Remove commented-out code
- [x] Remove unused imports
- [x] Remove unused files
- [x] Run linter and fix issues
- [x] Format all code with Prettier
- [x] Final TypeScript check
- [x] Final test run

**Acceptance Criteria:**

- No console warnings
- No lint errors
- Code is clean and formatted
- All tests pass

---

## Summary

**Total Estimated Time**: ~48 hours (6 working days)

**Task Distribution:**

- Foundation: 4 hours
- Mock API: 6 hours
- Utilities & Hooks: 4 hours
- Context: 3 hours
- Components: 12 hours
- Integration: 3 hours
- Testing: 8 hours
- Polish: 6 hours
- Documentation: 2 hours

**Critical Path:**

1. Foundation (types, data, images)
2. Mock API layer
3. Cart Context
4. Core components (ProductDetail, AddToCartButton)
5. Integration & testing

**High Priority Tasks:**

- All type definitions
- Mock API implementation
- Cart Context
- AddToCartButton component
- ProductDetail container
- Unit and component tests
- Accessibility audit

---

**Last Updated**: December 17, 2025
