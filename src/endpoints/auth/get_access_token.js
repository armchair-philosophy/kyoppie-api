var models = require("../../models")
var crypto = require("crypto")
module.exports = async function (appKey,appSecretHash,sigKey,pinCode,requestToken) {
    // 必須パラメータがあるかどうか
    if (!appKey) throw "appKey-is-require"
    if (!appSecretHash) throw "appSecret-is-is-require"
    if (!sigKey) throw "sigKey-is-require"
    if (!pinCode) throw "pinCode-is-require"
    if (!requestToken) throw "requestToken-is-require"
    // request_tokenなどが存在するかどうかを確認
    var app = await models.apps.findOne({appKey})
    var sig = await models.signatures.findOne({sigKey})
    var request_token = await models.request_tokens.findOne({token:requestToken})
    if (!app) throw "app-not-found"
    if (!sig || sig.app != app.id) throw "signature-not-found"
    if (!request_token || request_token.app != app.id) throw "requestToken-not-found"
    // 実際に署名して、appSecretが正しいかどうか確認する
    var secretHash = crypto.createHash("sha256").update(app.appSecret+sig.sigHash).digest("hex")
    if (secretHash !== appSecretHash) throw "invalid-appSecret"
    await sig.remove() // 署名が正しいことが確認できたので、署名を無効化
    // pinCodeを探す
    var pin_code = await models.pin_codes.findOne({code:pinCode})
    if (!pin_code) throw "pinCode-not-found"
    if (pin_code.request_token != request_token.id) throw "pinCode-not-found"
    // pinCodeがあった
    // request_tokenを無効化
    await models.request_tokens.findOne({token:requestToken}).remove()
    var access_token = await models.access_tokens.findOne({user:pin_code.user,app:app.id})
    // access_tokenがすでにあるならそれを使う
    if (access_token) {
        await models.pin_codes.findById(pin_code.id).remove()
        return access_token
    }
    // ないなら作る
    access_token = new models.access_tokens()
    access_token.user = pin_code.user
    access_token.app = pin_code.app
    access_token.secret = crypto.createHash("sha256").update(app.appKey+access_token.token+app.appSecret).digest("hex")
    await access_token.save()
    await models.pin_codes.findById(pin_code.id).remove()
    return access_token
}