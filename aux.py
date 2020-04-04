import requests

def validateRequestToWebsite(website):
    try:
        return requests.get(website).status_code == 200
    except Exception:
        return False

def writeFinalFile(new_list):
    new_file = open("existing_websites.txt",'w+')
    list(map(lambda x: new_file.write(x),new_list))

def generateUpdatedWebsiteFile(website_file):
    file_handler = open(website_file)
    return list(filter(lambda x: validateRequestToWebsite(x.rstrip()),file_handler))

if __name__ == '__main__':
   writeFinalFile(generateUpdatedWebsiteFile("websites.txt"))
