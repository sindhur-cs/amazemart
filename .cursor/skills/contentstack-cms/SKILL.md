---
name: contentstack-cms
description: Manage Contentstack CMS operations including publishing entries with DAM asset references, bulk publishing, and content management. Use when publishing content, syncing DAM assets to CMS, or performing bulk operations on Contentstack entries.
---

# Contentstack CMS Operations

## Publishing Entries

### Publish with DAM Asset References

When publishing entries that contain DAM assets (assets with `am` prefix UIDs), use the bulk publish API with references to sync DAM metadata.

**API Endpoint:** `POST https://api.contentstack.io/v3/bulk/publish`

**Required Query Parameters:**
- `x-bulk-action=publish`
- `approvals=true`

**Required Headers (MUST be headers, NOT query params):**
- `api_key: <your_api_key>`
- `api_version: 3.2` ⚠️ **MUST be a header, not a query parameter**
- `branch: main` (or your branch name)
- `authorization: <management_token>` ⚠️ **Use management token, NEVER use authtoken**
- `Content-Type: application/json`

**Authentication Note:**
- ❌ NEVER use `authtoken` header - this is for session-based auth and expires
- ✅ ALWAYS use `authorization` header with a **management token**
- Management tokens are long-lived and designed for API integrations

**Request Body Structure:**
```json
{
  "environments": ["<environment_uid>"],
  "locales": ["en-us"],
  "publish_with_reference": true,
  "entries": [
    {
      "uid": "<entry_uid>",
      "content_type": "<content_type_uid>",
      "version": <entry_version>,
      "locale": "en-us"
    }
  ],
  "rules": {
    "approvals": true
  }
}
```

**Important Notes:**
- Use environment **UID** (e.g., `blte4b9760c979c08e3`), not environment name (e.g., `dev`)
- Include entry **version** number
- The `api_version: 3.2` header is required for publish with references


## Publish Options

When publishing  entries , always ask the user:

1. **Publish with references** - Includes DAM images, syncs updated metadata (titles, descriptions)
2. **Publish content only** - Publishes entry without syncing DAM asset references


## DAM vs CMS Assets

| Asset Type | UID Pattern | Source |
|------------|-------------|--------|
| CMS Assets | `blt...` | Contentstack CMS |
| DAM Assets | `am...` | Contentstack DAM |

DAM asset metadata (titles, descriptions) must be synced to CMS by publishing with references.


## Checking Publish Queue Status

After initiating a publish, **always check the publish queue** to confirm the status and show results to the user.

**API Endpoint:** `GET https://api.contentstack.io/v3/publish-queue`

**Optional Query Parameters:**
- `limit=<number>` - Number of items to retrieve (default: 10)

**Response Fields:**
| Field | Description |
|-------|-------------|
| `entry.title` | Title of the published entry |
| `entry.uid` | UID of the published entry |
| `entry.locale` | Locale of the published entry |
| `entry.version` | Version that was published |
| `publish_details.status` | Status: `success`, `failed`, or `in_progress` |
| `published_at` | Timestamp of publish |
| `type` | `entry` or `asset` |
| `bulkJobId` | ID to correlate items from the same bulk publish |

**Example Response:**
```json
{
  "queue": [
    {
      "action": "publish",
      "entry": {
        "locale": "fr-fr",
        "version": 1,
        "title": "Volvo XC 90",
        "uid": "bltb7511e85dfa7793e"
      },
      "publish_details": {
        "status": "success"
      },
      "published_at": "2026-02-11T18:16:59.872Z",
      "type": "entry",
      "content_type": {
        "title": "Gallery Page",
        "uid": "gallery_page"
      }
    }
  ]
}
```

**Post-Publish Workflow:**
1. Submit bulk publish request
2. Wait briefly (1-2 seconds)
3. Query publish queue to get status
4. Display results to user with status (success/failed/in_progress)

## Validating Publish with References

When publishing with `publish_with_reference: true`, **verify the job contains multiple items**:

| Scenario | Expected Items | Indicates |
|----------|----------------|-----------|
| Entry + referenced assets | Multiple items (entry + each asset) | ✅ Correct - references are being published |
| Entry only | 1 item | ❌ Wrong - `api_version: 3.2` header missing or incorrect |

**Validation Steps:**
1. After publish, query `/v3/publish-queue` with the `bulkJobId`
2. Count items with matching `bulkJobId`
3. If only 1 item exists for an entry with DAM references → publish command is incorrect

**Common Causes of Missing References:**
- `api_version: 3.2` passed as query param instead of **header**
- Missing `branch` header
- Using `authtoken` instead of `authorization` with management token
- Using wrong endpoint (should be `api.contentstack.io` or `app.contentstack.com/api`)

**Example of Correct Publish (12 items):**
```
bulkJobId: 3fedde66-430a-4ce3-8e55-07360f6b85ad
Items: 1 entry (Volvo XC 90) + 11 assets (Side Profile, Front View, etc.)
```

**Example of Incorrect Publish (1 item only):**
```
bulkJobId: cs-46e3f67f-b1a6-465e-9dcf-fac184a0786c
Items: 1 entry only → References NOT published, check headers
```
