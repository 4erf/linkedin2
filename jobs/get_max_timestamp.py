import requests
import json

headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
}


def get_max_timestamp(url: str, index_name: str) -> int:
    agg_name = 'max_timestamp'
    query = {
        "size": 0,
        "aggs": {
            f"{agg_name}": {
                "max": {
                    "field": "@timestamp"
                }
            }
        }
    }
    req = requests.get(f'{url}/{index_name}/_search', data=json.dumps(query), headers=headers)
    return int(json.loads(req.content).get('aggregations', {}).get(agg_name, {}).get('value', 0))
