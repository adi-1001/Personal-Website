function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Message']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    }

    var payload = {};

    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e.parameter) {
      payload = e.parameter;
    }

    sheet.appendRow([
      new Date(),
      payload.name || 'Anonymous',
      payload.email || 'Not provided',
      payload.message || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Message recorded successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'active',
      message: 'Portfolio Contact Form Apps Script API is running!'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
