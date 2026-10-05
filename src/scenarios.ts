export type Decision = "YES" | "NO" | "YES_AFTER_DELAY";

export interface Scenario {
  id: string;
  title: string;
  shortDescription: string;
  task: string;
  expectedDecision: Decision;
  reason: string;
}

export const scenarios: readonly Scenario[] = [
  {
    id: "safe-payment-retry",
    title: "Safe Payment Retry",
    shortDescription:
      "The payment service is temporarily unavailable, but the API explicitly guarantees idempotency for requests using the same key. Even if the first request actually succeeded, repeating it cannot create another payment.",
    task: `POST /payments
Idempotency-Key: 9c7d2b4a0e1f6c835a2d1b0f4e3c5a7d

{
  "data": "..."
}

503 Service Unavailable

Retry?`,
    expectedDecision: "YES_AFTER_DELAY",
    reason:
      "Since the server returned a 503 Service Unavailable error and an idempotency key is provided, the payment request can be safely retried after a backoff delay.",
  },
  {
    id: "unsafe-payment-retry",
    title: "Unsafe Payment Retry",
    shortDescription:
      "The payment API returns 503 Service Unavailable with Retry-After: 10. However, the request does not use an idempotency key.",
    task: `POST /payments

{
  "data": "..."
}

503 Service Unavailable
Retry-After: 10

Retry?`,
    expectedDecision: "NO",
    reason:
      "Although the server returned a 503 error with a Retry-After header, the request lacks an idempotency key, meaning retrying a POST request could result in duplicate payments.",
  },
  {
    id: "idempotent-put",
    title: "Idempotent PUT",
    shortDescription:
      "The app sent the request, but the connection was lost before any response was received.",
    task: `PUT /users/42/preferences

{
  "language": "cs",
  "theme": "dark"
}

The connection was lost.

Retry?`,
    expectedDecision: "YES",
    reason:
      "Because HTTP PUT requests are idempotent by design, it is safe to retry the request after a lost connection without risking duplicate side effects.",
  },
  {
    id: "rate-limited-order",
    title: "Rate-Limited Order",
    shortDescription:
      "The customer already has items in the cart and the app tries to create an order. The order request is rate-limited before order creation begins, and the server returns 429 Too Many Requests, including Retry-After: 30.",
    task: `POST /cart

{
  "name": "coffee-cup",
  "count": 2
}

200 OK

POST /orders
429 Too Many Requests
Retry-After: 30

Retry?`,
    expectedDecision: "YES_AFTER_DELAY",
    reason:
      "Since the POST /orders request received a 429 Too Many Requests status with a Retry-After header, the operation should be retried after the specified delay.",
  },
  {
    id: "payment-details-conflict",
    title: "Payment Details Conflict",
    shortDescription:
      "The app is processing a payment that requires an additional authentication step. The details request uses its own idempotency key, but the API returns 409 Conflict with transient-error: false.",
    task: `POST /paymentMethods
200 OK

POST /payments
200 OK

The response requires an additional authentication step.

The customer completes the authentication.

POST /payments/details
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000

409 Conflict
transient-error: false
errorCode: 704

Retry the POST /payments/details request?`,
    expectedDecision: "NO",
    reason:
      "A 409 Conflict status with transient-error: false indicates a resource conflict or non-transient state issue that will not succeed on direct retry.",
  },
  {
    id: "non-idempotent-patch",
    title: "Non-Idempotent PATCH",
    shortDescription:
      "The app sends a request to increase the current inventory by 5 units. The connection is lost before a response is received, so the app does not know whether the server already applied the change.",
    task: `PATCH /inventory/ram/kingston

{
  "quantityIncrease": 5
}

The connection was lost.

Retry?`,
    expectedDecision: "NO",
    reason:
      "Since standard PATCH requests are not inherently idempotent, retrying after a lost connection risks applying the quantity increase twice if the server already processed the original request.",
  },
  {
    id: "idempotent-delete",
    title: "Idempotent DELETE",
    shortDescription:
      "The app sends a request to delete a session, but the connection is lost before any response is received. The app does not know whether the server already deleted the session.",
    task: `DELETE /sessions/123

The connection was lost.

Retry?`,
    expectedDecision: "YES",
    reason:
      "HTTP DELETE operations are naturally idempotent, making it safe to retry the request after a lost connection without changing the intended state of the system.",
  },
  {
    id: "service-unavailable",
    title: "Service Unavailable",
    shortDescription:
      "The reporting service is temporarily unavailable and explicitly tells the client when it may try again.",
    task: `GET /reports/monthly

503 Service Unavailable
Retry-After: 60

Retry?`,
    expectedDecision: "YES_AFTER_DELAY",
    reason:
      "Because HTTP GET requests are inherently idempotent and the 503 Service Unavailable response included a Retry-After header, the request can be safely retried after the specified delay.",
  },
  {
    id: "stale-resource-version",
    title: "Stale Resource Version",
    shortDescription:
      "The app loads a product and stores its current version. Another client modifies the product before the app tries to update it using the old ETag.",
    task: `GET /products/123
200 OK
ETag: "version-7"

{
  "price": 49.99
}

Another client updates the product.

PATCH /products/123
If-Match: "version-7"

{
  "price": 44.99
}

412 Precondition Failed

Retry the same PATCH request?`,
    expectedDecision: "NO",
    reason:
      "Retrying the exact same request with the stale ETag will consistently fail the precondition because the resource has already been modified on the server.",
  },
  {
    id: "rate-limit-without-retry-after",
    title: "Rate Limit Without Retry-After",
    shortDescription:
      "The API returns 429 Too Many Requests, but does not provide a Retry-After header. The client is currently being rate-limited.",
    task: `GET /products
429 Too Many Requests

GET /products
429 Too Many Requests

Retry?`,
    expectedDecision: "YES_AFTER_DELAY",
    reason:
      "Since GET requests are safe and idempotent but failed with rate limiting, the request should be retried after an exponential backoff or another reasonable delay.",
  },
  {
    id: "im-a-teapot",
    title: "I'm a Teapot",
    shortDescription:
      "The app tries to order coffee from a service, but the server responds with 418 I'm a Teapot.",
    task: `POST /coffee

418 I'm a Teapot

Retry?`,
    expectedDecision: "NO",
    reason:
      "A 418 I'm a Teapot response is a permanent client-server condition indicating that the server refuses to brew coffee because it is a teapot.",
  },
  {
    id: "eventual-consistency",
    title: "Eventual Consistency",
    shortDescription:
      "The app creates a new stock item successfully and immediately asks another service to process it, but the second request returns 404 Not Found.",
    task: `POST /stock/books

{
  "name": "Silmarillion",
  "count": 5
}

200 OK

{
  "id": 541
}

POST /stock/process/541

404 Not Found

Retry the second request?`,
    expectedDecision: "YES_AFTER_DELAY",
    reason:
      "The 404 error on the newly created resource is likely due to eventual consistency or replication lag between services, meaning a retry after a short delay will allow the backend state to propagate.",
  },
  {
    id: "expired-filter-workflow",
    title: "Expired Filter Workflow",
    shortDescription:
      "The app creates a temporary filter and receives an ID. The first two data requests time out. A later request returns 404 Not Found, meaning the previously created filter can no longer be used.",
    task: `POST /filter

{
  "dateFrom": "1999-10-01",
  "dateTo": "1999-10-01",
  "exclude": [1, 478, 4784]
}

200 OK

{
  "id": "aa-bbb-aa"
}

GET /filter/data?id=aa-bbb-aa

408 Request Timeout

Wait 60 sec

GET /filter/data?id=aa-bbb-aa

408 Request Timeout

GET /filter/data?id=aa-bbb-aa

404 Not Found

Retry a new POST /filter request?`,
    expectedDecision: "YES",
    reason:
      "The original filter resource was likely purged or failed to build after timing out, so generating a new filter request is required to obtain the data.",
  },
  {
    id: "cached-cart-options",
    title: "Cached Cart Options",
    shortDescription:
      "The customer adds a product to the cart and the app loads the available cart options. Later, another request for the same options fails with 504 Gateway Timeout.",
    task: `GET /products/345
200 OK

{
  "id": "345",
  "name": "dev-to-cup",
  "price": "39.99",
  "stock-count": "2"
}

POST /cart/add

{
  "id": "345",
  "count": 2
}

201 Created

GET /cart/options

200 OK
Date: Sat, 03 Oct 2026 10:02:54 GMT
Cache-Control: public, max-age=7200, stale-if-error=7200

GET /cart/1

200 OK

{
  "items": [
    {
      "id": "345",
      "count": 2
    }
  ]
}

GET /cart/options

504 Gateway Timeout
Date: Sat, 03 Oct 2026 12:03:05 GMT

Retry?`,
    expectedDecision: "NO",
    reason:
      "The cached /cart/options response is only 11 seconds beyond its two-hour max-age and is still inside the two-hour stale-if-error window, so the stale response can be used instead of retrying the failing request.",
  },
] as const;

export const decisionLabels: Readonly<Record<Decision, string>> = {
  YES: "Retry now",
  NO: "Do not retry",
  YES_AFTER_DELAY: "Retry, but wait first",
};
