import Backbone from 'backbone'
import ReactDOM from 'react-dom'
import React from 'react'

const app = function() {



	var MultiListingViewController = React.createClass({
        render: function(){

            console.log(this.props)
            return (
                <div className="appContainer">
                    <SearchBar listingData={this.props.searchItems}/>
                    <CategoryBar />
                    <MultiListingDisplay listingData={this.props.listingData}  />


                </div>

                )

        }

    })

    var SingleViewController = React.createClass({
        render: function(){
                return(
                    <div className="appContainer">
                    <SearchBar listingData={this.props.searchItems} />
                    <CategoryBar />
                    <SingleListingSummary />
                    </div>
            )
        }
    })

    var SearchBar = React.createClass({
        _handleSearch : function(e){
            var target = e.target
            console.log(target)
            e.preventDefault()
            location.hash = '#search/' + target.querySelector('input').value

            target.querySelector('input').value =''



        },

		render: function() {
			return (
                <form id="searchBar" onSubmit={this._handleSearch}>
                    <div>
                        <a href="#home">
                        <img src="http://www.knitnatural.com/uploads/1/6/1/9/16193668/7025640_orig.png" id="logo" />
                        </a>
                        <input type="text" placeholder="Search Etsy" />
                    </div>
                </form>

                )
		}
	})


var CategoryBar = React.createClass({
        render: function() {
            return (

            <div id="categoryBar">
                <ul>
                    <a href="#search/Clothing & Accessories">
                        <li className="categories">Clothing & Accessories</li>
                    </a>
                    <a href="#search/Jewelry" >
                        <li className="categories">Jewelry</li>
                    </a>
                    <a href="#search/Craft Supplies & Tools">
                        <li className="categories">Craft Supplies & Tools</li>
                    </a>
                    <a href="#search/Weddings">
                        <li className="categories">Weddings</li>
                    </a>
                    <a href="#search/Entertainment">
                        <li className="categories">Entertainment</li>
                    </a>
                    <a href="#search/Home & Living">
                        <li className="categories">Home & Living</li>
                    </a>
                    <a href="#search/Kids & Baby">
                        <li className="categories">Kids & Baby</li>
                    </a>
                    <a href="#search/Vintage">
                        <li className="categories">Vintage</li>
                    </a>
                </ul>
            </div>




                )
        }
    })



var MultiListingDisplay = React.createClass({
    _createSingleJSXEls: function(modelsArray){
        var jsxArray = []
        for(var i = 0; i < modelsArray.length; i++){

            var theJSX = <SingleListingSummary listingModel={modelsArray[i]} />
            jsxArray.push(theJSX)
        }
        return jsxArray


    },

    render: function() {
console.log('render()',this.props.listingData)
        var listingModels = this.props.listingData.models || [this.props.listingData]

        return (
            <div id="container">{this._createSingleJSXEls(listingModels)}</div>



            )


    }

})

var SingleListingSummary = React.createClass({
    render: function(){
        var htmlPic=null

         if (this.props.listingModel.get('Images').length > 0){
                    htmlPic = this.props.listingModel.get('Images')[0].url_170x135

                }else{
                    htmlPic='./placeholder.jpg'

                }

        return (<a
                    href={"#details/"+this.props.listingModel.get('listing_id')}
                    className="itemsContainer" data-pid={this.props.listingModel.get('listing_id')}>

                 <p className="title">{this.props.listingModel.get('title')}</p>
                 <img src={htmlPic} />
                 <p classNAme="price">{ this.props.listingModel.get('currency_code') + '  ' + this.props.listingModel.get('price') }</p>
                </a>



            )


    }


})



//keystring : ub1hcoexwc9g7jywvexn9g22
//shared secret : 8o6fy1cv39
//url : https://openapi.etsy.com/v2/listings/active.js?api_key=ub1hcoexwc9g7jywvexn9g22
//



var ItemsCollection = Backbone.Collection.extend({
    url: 'https://openapi.etsy.com/v2/listings/active.js',
//    '?includes=Images,Shop&',
    _key: 'ub1hcoexwc9g7jywvexn9g22',
    parse: function(res) {

        return res.results
    }
})


var ItemModel = Backbone.Collection.extend({


    generateUrl : function (id) {
        this.url ='https://openapi.etsy.com/v2/listings/'+ id +'.js?includes=Images,Shop&api_key=aavnvygu0h5r52qes74x9zvo&callback=?'},
    parse: function(res){
        return res.results
}

})


var EtsyRouter = Backbone.Router.extend({
    routes: {
        "details/:id": "doDetailView",
        "search/:keyword": "doItemSearchView",
        "home": "doListView",
        "*catchall": "goHome"
    },

    doDetailView: function(id) {


        var item = new ItemModel()
        item.generateUrl(id)
        console.log(item)
        item.fetch({

            dataType: 'jsonp',
            data: {
                api_key: item._key,
                includes: 'Images,Shop',
                processData: true,
                }

        }).then( function(d){
                 ReactDOM.render(<MultiListingViewController  listingData={item} />,document.querySelector('.container'))
        }

        )
    },


    doItemSearchView: function(keyword) {
        console.log(keyword)
        var searchItems = new ItemsCollection(keyword)
        searchItems.fetch({

                dataType: 'jsonp',
                data: {
                    api_key: searchItems._key,
                    includes: 'Images,Shop',
                    keywords: keyword,
                    limit:24,
                    processData: true,
                }

        }).then( function(d){
                 ReactDOM.render(<MultiListingViewController  listingData={searchItems} />,document.querySelector('.container'))
        }

        )




    },

    doListView: function() {
    //    console.log('home view')
        var listItems = new ItemsCollection()

        listItems.fetch({

            dataType: 'jsonp',
            data: {
                api_key: listItems._key,
                includes: 'Images,Shop',
                limit: 24,
                processData: true,
                }

        }).then( function(d){
            ReactDOM.render(<MultiListingViewController  listingData={listItems} />,document.querySelector('.container'))
        }
        )

    },

    goHome: function(){
        location.hash = 'home'},

    initialize: function() {

        Backbone.history.start()

    }
})

new EtsyRouter()


}
app()