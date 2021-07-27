module.exports = (_, res, postData) => {
  if (postData.api === 'SYNO.API.Encryption' && postData.method === 'getinfo' && postData.version === '1') {
    return res.end(JSON.stringify({
      data: {
        cipherkey: '__cIpHeRtExT',
        ciphertoken: '__cIpHeRtOkEn',
        public_key: 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAtor0IIbYkZYYXI+xZm6zYOTnMV3WPZses6BIyYdb6sA8dJ2kxyn0DL4Wfq8OEGx9kcYRXAHZm3AwLCPsgCp+5A6/shDSKc71hPUE0arVM5s28AbJJT3Ib+PVvpH1IzZtw3noI1wNlibYN3SSwYycLM2RnrSHJgR/nmN0M+K1yO/TkSujqUAp/95wKVGqkMmJcwuoQcypPZcAQZKbLnD0am4hHmyluzzU/q9fd/yQuiLU2Giwlbrm1tAtMoUECwowoDtqPcKDG8nnvUWbIKL4JJZNlP8Bdg3u2pYSBGwappIdSeKJtmqwsav5PR3frJsQqZTTX8V595gnk4pFmOsi5sx9MunJtJHLfE+EbsjVE+qHvSCFsIced4ULHB8G49zkZzgzKpddVdg80lGTiM6/n3+BlkBZCaUce1g2F2F0HGpt4+Xtge87pvJbk2KWAMO6kEhe6wYpydi62pcaPurtEYB0jK6FE0CGsCQccd0rOb4+fRVX3z3AfUvXZUtu9IHbYYFdJ111Bvs6kCSuVt3/QI2hLWPC8jbuu9eRyRChwEku/NZRF+VfTnePsurfyJp3NAGYna3Zp0A5PZjWOmpMWHmjsqQWQelolM3tTIcLkOd7Z748W8xKmBIOZqhXA/Tj1Gb7IPMslEq4YbkUQAgqqdBZYS/P3p6r9Af7Gmt4BC8CAwEAAQ==',
        server_time: 1626393881
      },
      success: true
    }))
  }
}
