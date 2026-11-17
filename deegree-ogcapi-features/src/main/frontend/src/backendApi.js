function retrieveThisDatasetUrl(){
  var baseUrl = retrieveBaseUrl();
  var indexIncludeDataset = (baseUrl.lastIndexOf("dataset") + 9)
  var indexOfDatasetId = baseUrl.substring(indexIncludeDataset, baseUrl.length ).indexOf( "/" ) + indexIncludeDataset;
  return baseUrl.substring ( 0, indexOfDatasetId );
}

function retrieveBaseUrl() {
    var featuresRefWithoutQuery = window.location.href;
    if (featuresRefWithoutQuery.indexOf('?') >= 0) {
        featuresRefWithoutQuery = featuresRefWithoutQuery.substr(0, featuresRefWithoutQuery.indexOf('?'));
    }
    if (featuresRefWithoutQuery.endsWith("/")) {
        featuresRefWithoutQuery = featuresRefWithoutQuery.substr(0, featuresRefWithoutQuery.length - 1);
    }
    if (featuresRefWithoutQuery.endsWith(".html")) {
        featuresRefWithoutQuery = featuresRefWithoutQuery.substr(0, featuresRefWithoutQuery.length - 5);
    }
    return featuresRefWithoutQuery;
}

function getMapConfigUrl() {
    var url = retrieveThisDatasetUrl() + "/config/map"
    if (import.meta.env.DEV) {
        url = toMockDataUrl(url)
    }
    return url
}

function toMockDataUrl(url) {
    var originalUrl = url
    url = url.replace("/to-be-replaced-by-context-path", "/to-be-replaced-by-context-path/mockdata") + ".json"
    console.log('DEVELOPMENT! ' + originalUrl + " -> " + url);
    return url    
}

function getJsonDataUrlForCurrentPage() {
    var url = retrieveBaseUrl()
    if (import.meta.env.DEV) {
        url = toMockDataUrl(url)
    }
    return url
}

function getHtmlConfigUrl() {
    var baseUrl = retrieveBaseUrl();
    var indexOfDataset = (baseUrl.lastIndexOf("dataset"))
    var url = baseUrl.substring(0, indexOfDataset) + "html";
    if (import.meta.env.DEV) {
        url = toMockDataUrl(url)
    }
    return url
}


export { getHtmlConfigUrl, getMapConfigUrl, getJsonDataUrlForCurrentPage };