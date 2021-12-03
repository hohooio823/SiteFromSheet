const download = (response)=>{
    return (`<!doctype html>

    <html lang="en">
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
        <style>
        * {text-align: center;justify-content: center;}
        .d-flex {flex-direction: column;}
        </style>
    </head>
    <body>
        <div class='container align-items-center d-flex ' >
            ${response}
        </div>
    </body>
    </html>`)
}
module.exports = {
    download
}