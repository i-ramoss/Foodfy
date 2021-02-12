module.exports = {
  date(timestamp) {
    const date = new Date(timestamp)

    const year = date.getUTCFullYear()
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)
    const day = `0${date.getUTCDate()}`.slice(-2)

    return {
      iso: `${year}-${month}-${day}`
    }
  },

  emailTemplate(content) {
    return `
      <body style="margin:0;padding:0;font-family: helvetica;color:#444;">
        <table width="100%" align="center" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td style="padding:20px 0;" bgcolor="#111" align="center">
              <img
                style="display:block;"
                alt="Logo Foodfy"
                src="https://raw.githubusercontent.com/i-ramoss/Foodfy/master/public/assets/logo_white.png"
              />
            </td>
          </tr>
          <tr>
          <td style="padding:20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:30px 0;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        
          <tr>
            <td style="padding:20px 10px" bgcolor="#eee">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td width="480" style="color:#999;" align="center">Todos direitos reservados, receitas Foodfy</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `
  }
}