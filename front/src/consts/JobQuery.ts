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
            "fields": ["description", "title"],
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
            "company_name": ["epam"]
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
            "description": [
              "fare", "anche", "qualsiasi", "dove", "buono", "essere", "esperienza",
              "profilo", "conoscenze", "avere", "posizione", "delle", "della"
            ]
          }
        }
      ]
    }
  }
})
