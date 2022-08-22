import { QueryParams } from '../types/QueryParams';

export const JobQuery = (query: QueryParams, fields: string[], latest?: string) => ({
  ...(fields?.length ? { "_source": fields } : {}),
  "size": 10000,
  "query": {
    "bool": {
      "must": [
        { "match_all": {} },
        ...(latest ? [{
          "match": {
            "@timestamp":  latest
          }
        }] : [])
      ],
      "should": [
        {
          "query_string": {
            "fields": ["description", "title"],
            "query": query.search
          }
        },
        {
          "range": {
            "company_staff_count": {
              "gte": query.staffValue,
              "boost": query.staffWeight
            }
          }
        },
        {
          "range": {
            "listed_at": {
              "gte": `now-${query.daysValue}d`,
              "boost": query.daysWeight
            }
          }
        },
        {
          "match": {
            "prediction": {
              "query": true,
              "boost": query.predWeight
            }
          }
        }
      ],
      "must_not": [
        {
          "terms": {
            "company_name": []
          }
        },
        {
          "terms": {
            "description": ["die", "das", "der", "und", "sein"]
          }
        },
        {
          "terms": {
            "description": ["pour", "avoir", "dans", "faire", "volonté", "aussi", "tâches"]
          }
        },
        {
          "terms": {
            "description": [
              "fare", "anche", "qualsiasi", "dove", "buono", "essere", "esperienza",
              "profilo", "conoscenze", "avere", "posizione", "delle", "della", "interessati",
            ]
          }
        }
      ]
    }
  }
})
