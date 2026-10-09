# Basket spec

What the Acme Widget Co basket has to do, what the brief leaves open, and the call this repo makes on each open point. This file is the working document the build followed. For the current state, `README.md` and `ADR.md` are the reference.

## 1. What the brief asks for

### Catalogue

| Product      | Code | Price  | Cents |
|--------------|------|--------|-------|
| Red Widget   | R01  | $32.95 | 3295  |
| Green Widget | G01  | $24.95 | 2495  |
| Blue Widget  | B01  | $7.95  | 795   |

### Delivery

| Amount spent      | Delivery |
|-------------------|----------|
| under $50         | $4.95    |
| $50 to under $90  | $2.95    |
| $90 or more       | free     |

### Offers

One offer for now: buy one red widget, get the second half price. The brief says Acme is "experimenting" with offers, so more will come.

### Basket interface

- It is created with the product catalogue, the delivery charge rules and the offers. The format is up to us.
- `add(productCode)` adds one product.
- `total()` returns the total including delivery and offers.

### Expected totals

| Products                | Total  |
|-------------------------|--------|
| B01, G01                | $37.85 |
| R01, R01                | $54.37 |
| R01, G01                | $60.85 |
| B01, B01, R01, R01, R01 | $98.27 |

### Deliverables

- Backend in modern Node/TypeScript that is easy to understand.
- Simple UI in React/TypeScript. It doesn't need polish, but it can't be ugly.
- README explaining how it works and the assumptions made.
- Public GitHub repo.

## 2. What the examples settle

The brief never says how offers, delivery and rounding interact. The expected totals do, and they leave one answer for each.

**Delivery uses the subtotal after offers.** R01, R01 is 3295 + 3295 = 6590 before the offer and 3295 + 1647 = 4942 after it. Using 6590 puts delivery at $2.95 and the total at 4942 + 295 = $52.37. Using 4942 puts delivery at $4.95 and the total at 4942 + 495 = $54.37, the expected answer.

**The half-price item rounds down to the cent.** Half of 3295 is 1647.5. Charging 1647 gives $54.37. Charging 1648 gives $54.38. Half-up rounding and banker's rounding both land on $54.38, so neither is what the brief uses. The rule is "the discounted item costs `floor(price / 2)`", which means the customer gets the half cent.

**The offer repeats per pair, as far as the examples go.** B01, B01, R01, R01, R01 is 1590 + (3295 + 1647 + 3295) = 9827, free delivery, $98.27. Three reds get one discount. That fits "every second red is half price" and also "only one discount per basket". The examples can't tell them apart. See 3.1.

**Thresholds are on the amount, with $50 and $90 as the lower bounds of the cheaper bands.** "Under $50" and "$90 or more" make $50.00 cost $2.95 and $90.00 ship free. None of the examples hit a boundary, so tests must cover 4999, 5000, 8999 and 9000.

## 3. Gaps in the brief and the call we make

Each of these goes into the README's Assumptions section once built.

### 3.1 Does the red offer repeat?

The brief says "buy one, get the second half price". Four reds could mean one discount or two. We apply it to every pair: 4 reds pay 2 × (3295 + 1647). That is how retail BOGO-style offers usually work, and it is the reading a customer would expect. The single-use reading is a one-line change in the offer class if Acme wants it.

### 3.2 How do offers combine?

Only one offer exists, but the brief expects more. Undecided questions: can two offers apply to the same item, in what order do they run, does a later offer see prices already discounted by an earlier one? We keep it simple. Each offer looks at the items and returns a discount in cents, offers don't see each other's discounts, and the basket sums them. That is enough for the current offer and doesn't pretend to solve stacking. If a second offer needs to interact with the first, that is a new decision and gets an ADR.

### 3.3 Empty basket

Taken literally, an empty basket is "under $50" and costs $4.95. Charging delivery on nothing is wrong, so an empty basket totals $0.00. This is our call, not the brief's.

### 3.4 Unknown product code

The brief doesn't say what `add("X99")` does. It throws a domain error, and the API answers 422 with the bad code. Silently ignoring it would hide typos in the UI or in API calls.

### 3.5 Rounding beyond this offer

The floor rule comes from one example. Other percentage offers could produce fractional cents too. The rule we apply everywhere is: compute each discount in integer cents and round it so the customer pays the lower amount. Money never exists as a float in the domain.

### 3.6 "Total" means what?

`total()` returns one number. The UI is more useful with the breakdown (subtotal, discounts, delivery, total), so the API returns all four and the domain `total()` stays as the brief describes it.

### 3.7 Currency and tax

Prices are in dollars with no currency stated and no mention of tax. We treat everything as USD, tax included or not applicable, and say so.

### 3.8 Things not asked for

The brief only asks for `add`. Removing items, changing quantities, checkout, stock, users and persistence are out of scope. The UI will likely need "remove" or "clear" to be usable, so the basket gets a `clear` or the UI rebuilds the basket from its own item list. Anything more stays out.

## 4. Criticism of the brief and of our setup

**The brief is mostly a domain kata.** The interesting part is about 100 lines of TypeScript: a catalogue, a delivery rule and an offer. "Easy to understand" is the stated bar, so the review will likely focus on how cleanly that core reads and how it is tested, not on infrastructure.

**Our setup is heavier than the brief needs.** NestJS, Docker Compose, Make, CI and ADRs are a lot around a basket. That is defensible only if the domain stays plain TypeScript with no Nest imports, has its own unit tests, and could be lifted out as-is. If a reviewer has to read through modules and DI to find the pricing rules, the setup works against "easy to understand". The README should point straight at the domain folder.

**The interface is stateful but the API doesn't need to be.** `add` then `total` describes an object, not an endpoint. A stateless `POST /basket/total` that takes a list of codes and returns the breakdown keeps the server free of sessions and matches the brief's object one to one inside the handler (create basket, `add` each code, call `total`). Server-side baskets with IDs would add storage and expiry for no gain in a proof of concept.

**"Initialised with catalogue, delivery rules and offers" is the real test.** It asks for dependency injection of the rules. Hard-coding the delivery bands or the red offer inside `Basket` would pass the four examples and fail the point of the exercise. Delivery rules and offers should be interfaces with one implementation each, passed in at construction.

**Four examples are not a test suite.** They are the minimum. Add boundary cases (exactly $50 and $90, before and after the discount), 4 reds, an empty basket and an unknown code.

## 5. What is missing in the repo

Backend domain (plain TypeScript, `backend/src/domain`):
- [x] `Product` and `Catalogue` with prices in cents
- [x] `DeliveryRule` interface and a tiered implementation built from bands
- [x] `Offer` interface and the red "second half price" implementation
- [x] `Basket` with `add(code)` and `total()`, taking catalogue, delivery rule and offers in the constructor
- [x] Domain error for unknown codes
- [x] Unit tests: the four examples, boundaries at 4999/5000/8999/9000, 4 reds, empty basket, unknown code

Backend API:
- [x] Nest module wiring the catalogue, delivery rule and offers
- [x] `GET /products` for the UI
- [x] `POST /basket/total` taking `{ items: string[] }` and returning subtotal, discount, delivery and total in cents
- [x] Request validation and a 4xx for unknown codes
- [x] e2e tests for both endpoints, including the four examples

Frontend:
- [x] Product list with "add" buttons
- [x] Basket panel with items, remove/clear, and the price breakdown
- [x] Money formatting at the edge (cents to `$x.xx`)
- [x] Loading and error states

Delivery:
- [x] README "How it works" and "Assumptions", taken from section 3 of this file
- [x] ADR for the stateless basket API
- [x] `make build` and `make test` verified on the dev images; prod images built and smoke-tested with `BUILD_TARGET=prod docker compose up --build --wait` and curl
- [x] Push to a public GitHub repo, then confirm CI passes (first run green on all four jobs)
