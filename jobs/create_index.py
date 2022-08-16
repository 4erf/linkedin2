import requests
import json


def create_index(url: str, name: str):
    query = {
        'mappings': {
            "properties": {
                "@timestamp": {
                    "type": "date",
                    "format": "epoch_millis"
                },
                "apply_link": {
                    "type": "keyword"
                },
                "company_category": {
                    "type": "keyword"
                },
                "company_description": {
                    "type": "keyword"
                },
                "company_hq_city": {
                    "type": "keyword"
                },
                "company_hq_country": {
                    "type": "keyword"
                },
                "company_logo": {
                    "type": "keyword"
                },
                "company_name": {
                    "type": "text"
                },
                "company_staff_count": {
                    "type": "long"
                },
                "description": {
                    "type": "text"
                },
                "id": {
                    "type": "keyword"
                },
                "listed_at": {
                    "type": "date",
                    "format": "epoch_millis"
                },
                "location": {
                    "type": "keyword"
                },
                "remote_allowed": {
                    "type": "boolean"
                },
                "title": {
                    "type": "text"
                }
            }
        }
    }
    requests.put(url + f'/{name}', data=json.dumps(query), headers={
        "Content-Type": "application/x-ndjson",
    })
