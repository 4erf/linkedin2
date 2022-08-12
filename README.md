# LinkedIn<sup>2</sup>

<b>Search smarter not harder.</b>

<p align="center">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./images/dark.jpg">
      <img alt="LinkedIn^2" src="./images/light.jpg" width="500">
    </picture>
</p>

LinkedIn<sup>2</sup> is a utility to rank jobs according to desired keywords or features, for example:

``(python OR pytorch OR "deep learning") AND NOT (c# OR c++)``

Also keep track of already seen jobs, already applied ones and (really) new posted jobs.

## Query string

It's true that LinkedIn already allows <a href="https://www.linkedin.com/help/linkedin/answer/a524335/using-boolean-search-on-linkedin?lang=en" target="_blank">boolean search</a>, however, it doesn't have all the power of elasticsearch's <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html" target="_blank">query string</a>.

| Method           | Example|
|------------------|---|
| Wildcards        | ``qu?ck bro*``|
| Regex            | ``/joh?n(ath[oa]n)/``|
| Fuzziness        | ``quikc~ brwn~ foks~``|
| Proximity search | ``"fox quick"~5``|
| Ranges           | ``[1 TO 5]``|
| Boosting         | ``LinkedIn^2``|

## Feature rank
And not only that, it also allows taking features like company's employee count and job posted date, then rank higher those posts that meet a certain threshold for them.

| Feature           | Threshold | Weight |
|-------------------| --- | --- |
| Employees         | 5000 | 4 |
| Posted n days ago | 15 | 2 |

## Installation
### LinkedIn API
First, install my own fork of the <a href="https://github.com/tomquirk/linkedin-api" target="_blank">linkedin-api</a> package
```bash
pip install git+https://github.com/4erf/linkedin-api.git
```
It tries to circumvent the 1000 job limit of LinkedIn's voyager api.

Then, on `jobs` folder, create a `.secrets.json` which contains your LinkedIn accounts, the more accounts the faster the fetch process and less likely you get rate limited.
```json
[
  ["email1@domain.tld", "pass1"],
  ["email2@domain.tld", "pass2"]
]
```
Now you can modify the `include` and `exclude` arrays in `get_jobs.py`, together with `job_type`, `location_name`, and other parameters received by the `get_all_jobs` function. 

This allows you to run a pre-filtering using LinkedIn built-in search, to facilitate the fetch process excluding definitely irrelevant jobs.

### Elasticsearch
Now, on the root folder, run
```bash
docker compose up
```
to run both elasticsearch and Kibana nodes. 

You can then log into Kibana by going to `localhost:5601` and activating manually using elasticsearch's address `http://es01:9200`. This is just in case you want to have Kibana access, not needed to use the app.

### Fetching jobs
Now to fetch all jobs matching the query, run:
```bash
python get_jobs.py
```
This will first try to get the highest % of jobs possible, circumventing LinkedIn limitations, when you reach a reasonable %, press `Ctrl+C` and now wait for the job details to be fetched.

After finished, it will give create three json files, `jobs_src` which contains just the initial list of jobs, `jobs` which contains jobs with all the additional information added to them, and `jobs_nd` which is used to insert the data into elasticsearch.

These files are just in case you want them for other purposes, the jobs will be on elasticsearch already, ready to use.

### Front-end
Now, to visualize jobs and interact with the system in general, run
```bash
yarn install
```
on the `front` folder, and then run 
```bash
yarn start
```
This will fire up the web app, and you should be able to see your list of jobs, apply filters, mark as seen, applied, etc.

## To-do
- [ ] Simplify installation process, automate as much as possible, maybe containerize everything
- [ ] Automatically fetch new jobs, right now the process has to be repeated, though it's possible to only fetch jobs posted after certain date, reducing the amount of API calls needed.