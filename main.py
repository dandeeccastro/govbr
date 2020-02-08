import requests
import sys
from multiprocessing.dummy import Pool
import itertools

from bs4 import BeautifulSoup as bs 
import numpy as np

def gatherDomainsFromFile(file_name):
    return list( map( lambda x: x.rstrip()[8:], open(file_name)))

def gatherConnectionVectorFromDomain(domain, domain_list):
    try:
        response_html = requests.get('https://' + domain).content
    except Exception as e:
        return np.zeros((len(domain_list),1))
    finally:
        print(domain_list.index(domain))
    links = bs(response_html, 'html.parser').find_all('a')
    hrefs = list(map(lambda x: x.get('href'),links))
    filtered_result = list( filter( lambda x: "gov.br" in str(x) , hrefs ))
    domain_result = list(map(lambda x: ".".join( x.split('/')[2].split('.')[1:]) , filtered_result))
    np_result = np.array(list(map(lambda x: int(x in domain_result), domain_list)),ndmin=1).reshape((len(domain_list),1))
    return np_result

if __name__ == '__main__':
    domain_list = gatherDomainsFromFile('websites.txt')
    pool = Pool(4)
    result = np.array(list(map(lambda x,y: gatherConnectionVectorFromDomain(x,y),domain_list,itertools.repeat(domain_list))),ndmin=len(domain_list))
    print(result)
