import json
import sys
import os
import time
import threading
from concurrent.futures import ThreadPoolExecutor

dir_ = os.path.abspath(os.path.dirname(__file__))

sys.path.append(dir_ + '/api')  # TODO: remove
from linkedin_api import Linkedin
from parse_description import parse_description

pool_size = 20
max_tries = 10

with open(dir_ + '/.secrets.json') as file:
    apis = [
        Linkedin(*secret, pool_size=pool_size)
        for secret in json.load(file)
    ]

thread_api_mapping = {}

include = [
    'Data Engineer', 'Machine Learning', 'Data Scientist', 'AI', 'ML',
    'Software Engineer', 'Software Developer', 'JavaScript Developer', 'Deep Learning',
]

exclude = ['Ph.D', 'PhD', 'Intern', 'Data Analyst']

search = f'''("{'" OR "'.join(include)}") AND NOT ("{'" OR "'.join(exclude)}")'''
print(search, file=sys.stderr)

jobs = apis[1].get_all_jobs(
        search, job_type='F', location_name='Switzerland', workplaceType=('1', '3'),
)

with open(dir_ + '/jobs_src.json', 'w') as file:
    json.dump(jobs, file)

with open(dir_ + '/jobs_src.json') as file:
    jobs = json.load(file)


def map_job(item):
    i, job = item
    tid = threading.get_ident()

    if not thread_api_mapping.get(tid):
        thread_api_mapping[tid] = apis[len(thread_api_mapping) // pool_size]

    api = thread_api_mapping[tid]

    if not i % 10:
        print(f'Augmenting job #{i + 1}', file=sys.stderr)

    if not job['companyDetails'].get('company'):
        return None

    job_id = job['dashEntityUrn'].split(':')[-1]
    company_id = job['companyDetails']['company'].split(':')[-1]

    full_job = None
    company = None
    i = 0
    while not full_job or not company:
        try:
            full_job = api.get_job(job_id)
            company = api.get_company(company_id)
        except:
            if i == max_tries:
                print(f'Failed getting {"company" if company else "job"} for job id: {job_id}', file=sys.stderr)
                return None
            time.sleep(1)
        i += 1

    company_logo_obj = company.get('logo', {}).get('image', {}).get('com.linkedin.common.VectorImage')
    company_logo = company_logo_obj['rootUrl'] + company_logo_obj['artifacts'][1]['fileIdentifyingUrlPathSegment'] if company_logo_obj else None

    apply_link_obj = list(full_job['applyMethod'].values())[0]
    apply_link = apply_link_obj.get('companyApplyUrl') or apply_link_obj.get('easyApplyUrl')

    return {
        'id': job_id,
        'location': job['formattedLocation'],
        'listed_at': job['listedAt'],
        'title': job['title'],
        'remote_allowed': job['workRemoteAllowed'],
        'description': parse_description(full_job['description']['attributes'], full_job['description']['text']),
        'apply_link': apply_link,
        'company_name': company['name'],
        'company_description': company.get('description', '').split('.')[0],
        'company_staff_count': company['staffCount'],
        'company_category': company['companyIndustries'][0]['localizedName'],
        'company_hq_country': company.get('headquarter', {}).get('country'),
        'company_hq_city': company.get('headquarter', {}).get('city'),
        'company_logo': company_logo,
    }


with ThreadPoolExecutor(max_workers=pool_size * len(apis)) as executor:
    augmented_jobs = executor.map(map_job, enumerate(jobs))
    print(json.dumps([job for job in augmented_jobs if job is not None]))
