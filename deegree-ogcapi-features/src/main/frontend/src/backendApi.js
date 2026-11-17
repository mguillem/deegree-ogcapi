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

function getCurrentPageUrlWithQuery(query) {
    var url = retrieveBaseUrl()
    if (query) {
        url += "?" + query
    }

    return mockUrlIfDev(url)
}

function getMapConfigUrl() {
    var url = retrieveThisDatasetUrl() + "/config/map"
    return mockUrlIfDev(url)
}

function mockUrlIfDev(url) {
    if (import.meta.env.DEV) {
        var originalUrl = url
        var query = ""
        if (url.indexOf("?") > 0) {
            query = "_" + url.replace(/.*\?/, '')
            url = url.replace(/\?.*/, '')
        }
        url = url.replace("/to-be-replaced-by-context-path", "/to-be-replaced-by-context-path/mockdata") + query + ".json"
        console.log('DEVELOPMENT! ' + originalUrl + " -> " + url);
    }
    return url
}


function getJsonDataUrlForCurrentPage() {
    var url = retrieveBaseUrl()
    return mockUrlIfDev(url)
}

function getHtmlConfigUrl() {
    var baseUrl = retrieveBaseUrl();
    var indexOfDataset = (baseUrl.lastIndexOf("dataset"))
    var url = baseUrl.substring(0, indexOfDataset) + "html";
    return mockUrlIfDev(url)
}

function getCurrentFeatureCollectionUrl() {
    var url = retrieveBaseUrl()
    if (url.endsWith("/items")) {
        return mockUrlIfDev(url.replace("/items", ""))
    }
    throw "Wrong context"
}

export { getHtmlConfigUrl, getMapConfigUrl, getJsonDataUrlForCurrentPage, getCurrentFeatureCollectionUrl, getCurrentPageUrlWithQuery };