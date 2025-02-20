const { nanoid } = require('nanoid');
const Url = require('../models/url');

async function handleGenerateNewShortURL(req,res) {
    const body=req.body;
    if(!body.url)
    {
        return res.status(400).json({error:"URL is required"});
    }
  const shortId = nanoid(6);
  await Url.create({shortId, 
                    redirectUrl: body.url,
                    visitHistory: [{ timestamp: Date.now() }],createdBy:req.user._id });
   
    return res.render('home',{id: shortId});
}


async function handleRedirectToOriginalURL(req,res) {
    const shortId = req.params.shortId;
    const url = await Url.findOne({
        shortId
    });
    if(!url)
    {
        return res.status(404).json({error:"URL not found"});
    }
    url.visitHistory.push({timestamp:Date.now()});
    await url.save();
    return res.redirect(url.redirectUrl);
}

async function handleGetAnalytics(req,res) {
    const shortId = req.params.shortId;
    const url = await Url.findOne({
        shortId
    });
    if(!url)
    {
        return res.status(404).json({error:"URL not found"});
    }
    return res.json({visitCount:url.visitHistory.length,analytics:url.visitHistory});
}

module.exports = { handleGenerateNewShortURL, handleRedirectToOriginalURL, handleGetAnalytics };