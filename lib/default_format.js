var dateFormat = function(ts) {
    var date = new Date(ts);
    return date.toISOString();
};


var counters = function (key, value, ts, bucket) {
    var listKeys = key.split('.');
    var project = listKeys.shift();
    var metric = listKeys.join('.');
    bucket.push({
        "project": project || '',
        "metric": metric || '',
        "value": value,
        "@timestamp": dateFormat(ts)
    });
    return 1;
}

var timers = function (key, series, ts, bucket) {
    var listKeys = key.split('.');
    var project = listKeys.shift();
    var metric = listKeys.join('.');
    var timestamp = dateFormat(ts);
    for (keyTimer in series) {
      bucket.push({
        "project": project || '',
        "metric": metric || '',
        "duration": series[keyTimer],
        "@timestamp": timestamp
     });
    }
    return series.length;
}

var timer_data = function (key, value, ts, bucket) {
    var listKeys = key.split('.');
    var project = listKeys.shift();
    var metric = listKeys.join('.');
    value["@timestamp"] = dateFormat(ts);
    value["project"]  = project || '';
    value["metric"] = metric || '';
    if (value['histogram']) {
      for (var keyH in value['histogram']) {
        value[keyH] = value['histogram'][keyH];
      }
      delete value['histogram'];
    }
    bucket.push(value);
}

exports.counters   = counters;
exports.timers     = timers;
exports.timer_data = timer_data;
exports.gauges     = counters;
