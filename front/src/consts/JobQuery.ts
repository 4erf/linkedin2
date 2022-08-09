import { QueryParams } from '../types/QueryParams';

export const JobQuery = (query: QueryParams, fields: string[]) => ({
  ...(fields?.length ? { "_source": fields } : {}),
  "size": 10000,
  "query": {
    "bool": {
      "must": [
        { "match_all": {} }
      ],
      "should": [
        {
          "query_string": {
            "default_field": "description",
            "query": query.search
          }
        },
        {
          "function_score": {
            "query": {
              "range": {
                "company_staff_count": {
                  "gte": query.staffValue
                }
              }
            },
            "boost": query.staffWeight
          }
        },
        {
          "function_score": {
            "query": {
              "range": {
                "listed_at": {
                  "gte": `now-${query.daysValue}d`
                }
              }
            },
            "boost": query.daysWeight
          }
        }
      ],
      "must_not": [
        {
          "terms": {
            "description": ["phd", "ph.d"]
          }
        },
        {
          "terms": {
            "description": ["die", "das", "der", "und", "sein"]
          }
        },
        {
          "terms": {
            "description": ["pour", "avoir", "dans", "faire", "volonté", "aussi"]
          }
        },
        {
          "terms": {
            "description": ["fare", "anche", "qualsiasi", "dove", "buono", "essere"]
          }
        }
      ]
    }
  }
})
