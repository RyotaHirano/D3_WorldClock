import zeroPadding from '../lib/zero-padding';

export default function setWorldTime(timezone) {
  startTimezone = timezone;

  //標準時の取得
  const standerdTimeGMT = (new Date()).getTime() + (new Date()).getTimezoneOffset() * 60 * 1000;
  //時差分を加える
  const standerdTime = new Date(standerdTimeGMT + (parseInt(timezone, 10) * 60 * 60 * 1000));
  const formatYYYYMMDDW = standerdTime.getFullYear() + '/' + (standerdTime.getMonth() + 1) + '/' + standerdTime.getDate() + ' (' + weekDay[standerdTime.getDay()] + ')';
  d3.select('#worldDate').text(formatYYYYMMDDW);

  const formatSelectCountryTime = standerdTime.getHours() + ":" + zeroPadding(standerdTime.getMinutes()) + ":" + zeroPadding(standerdTime.getSeconds()) + ":" + zeroPadding(standerdTime.getMilliseconds());
  d3.select('#worldTime').text(formatSelectCountryTime);
}
