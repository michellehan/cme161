/*

API returns entire iris dataset
http://tranquil-peak-82564.herokuapp.com/api/v1.0/data/iris/

API returns n=10 entries from dataset, useful for debugging
http://tranquil-peak-82564.herokuapp.com/api/v1.0/data/iris/limit/10/

data is in this format
{"sepal_length":5.1,"sepal_width":3.5,"petal_length":1.4,"petal_width":0.2,"species":"setosa"}

*/

// on load data {

	// crossfilter

  // dimensions for sepal_length, sepal_width, petal_length, petal_width, species

  // unique values for species (hint: underscore.js)

	// bar charts for sepal_length, sepal_width, petal_length, petal_width, species

	// render

// } end load data


d3.json("http://tranquil-peak-82564.herokuapp.com/api/v1.0/data/iris/", function(remote_json){

  window.remote_json = remote_json;

  // crossfilter
  var cf            = crossfilter(remote_json);

  // dimension; round to the nearest .5
  var sepal_length  = cf.dimension(function(d){return Math.round(d.sepal_length * 2)/2; });
  var sepal_width   = cf.dimension(function(d){return Math.round(d.sepal_width * 4)/4; });
  var petal_length  = cf.dimension(function(d){return Math.round(d.petal_length * 2)/2; });
  var petal_width   = cf.dimension(function(d){return Math.round(d.petal_width * 4)/4; });
	var species       = cf.dimension(function(d){return d.species;});

  // groups
  var sepal_length_sum = sepal_length.group().reduceSum(function(d){ return d.sepal_length; });
  var sepal_width_sum  = sepal_width.group().reduceSum(function(d){ return d.sepal_width; });
  var petal_length_sum = petal_length.group().reduceSum(function(d){ return d.petal_length; });
  var petal_width_sum  = petal_width.group().reduceSum(function(d){ return d.petal_width; });
  var species_sum      = species.group().reduceCount();


  /* implement unique species name extraction */
  window.species_names = _.chain(remote_json).pluck("species").uniq().value();


  var species_chart = dc
    .barChart("#dcjs_flower_species_chart", "bar")
    .width(250)
    .height(200)
    .dimension(species)
    .group(species_sum)
    .centerBar(true)
    .elasticY(true)
    .x(d3.scale.ordinal().domain(species_names))
    .xUnits(dc.units.ordinal);

  var sepal_length_chart = dc
    .barChart("#dcjs_flower_sepal_length_chart", "bar")
    .width(250)
    .height(200)
    .dimension(sepal_length)
    .group(sepal_length_sum)
    .centerBar(true)
    .elasticY(true)
    .x( d3.scale.linear().domain([3,10]) )
    .xUnits(dc.units.fp.precision(.5));

   var sepal_width_chart = dc
    .barChart("#dcjs_flower_sepal_width_chart", "bar")
    .width(250)
    .height(200)
    .dimension(sepal_width)
    .group(sepal_width_sum)
    .centerBar(true)
    .elasticY(true)
    .x( d3.scale.linear().domain([1.5,5]) )
    .xUnits(dc.units.fp.precision(.25));

   var petal_length_chart = dc
    .barChart("#dcjs_flower_petal_length_chart", "bar")
    .width(250)
    .height(200)
    .dimension(petal_length)
    .group(petal_length_sum)
    .centerBar(true)
    .elasticY(true)
    .x( d3.scale.linear().domain([0,7]) )
    .xUnits(dc.units.fp.precision(.5));

   var petal_width_chart = dc
    .barChart("#dcjs_flower_petal_width_chart", "bar")
    .width(250)
    .height(200)
    .dimension(petal_width)
    .group(petal_width_sum)
    .centerBar(true)
    .elasticY(true)
    .x( d3.scale.linear().domain([-0.25,3]) )
    .xUnits(dc.units.fp.precision(.25));

  var species_pie = dc
    .pieChart("#dcjs_flower_species_chart", "pie")
    .width(250)
    .height(200)
    .dimension(species)
    .group(species_sum)
    .renderLabel(true)
  	.label(function (d) { return (d.data.key + " (n=" + d.value + ")"); });

  var sepal_length_pie = dc
     .pieChart("#dcjs_flower_sepal_length_chart", "pie")
     .width(250)
     .height(200)
     .dimension(sepal_length)
   	 .group(sepal_length_sum)
    .renderLabel(true)
  	.label(function (d) { return (d.data.key + " (n=" + Math.round(d.value) + ")"); });

   var sepal_width_pie = dc
    .pieChart("#dcjs_flower_sepal_width_chart", "pie")
    .width(250)
    .height(200)
    .dimension(sepal_width)
    .group(sepal_width_sum)
    .renderLabel(true)
  	.label(function (d) { return (d.data.key + " (n=" + Math.round(d.value) + ")"); });

   var petal_length_pie = dc
    .pieChart("#dcjs_flower_petal_length_chart", "pie")
    .width(250)
    .height(200)
    .dimension(petal_length)
    .group(petal_length_sum)
    .renderLabel(true)
  	.label(function (d) { return (d.data.key + " (n=" + Math.round(d.value) + ")"); });

   var petal_width_pie = dc
    .pieChart("#dcjs_flower_petal_width_chart", "pie")
    .width(250)
    .height(200)
    .dimension(petal_width)
    .group(petal_width_sum)
    .renderLabel(true)
  	.label(function (d) { return (d.data.key + " (n=" + Math.round(d.value) + ")"); });

  /* implement (this is tricky)  */

	//add reRender functions for triggered actions
	var reRender = function(){
    if (isPie_s == 1) { species_pie.render(); }
    else { species_chart.render(); }
    if (isPie_sl == 1) { sepal_length_pie.render(); }
    else { sepal_length_chart.render(); }
    if (isPie_sw == 1) { sepal_width_pie.render(); }
    else { sepal_width_chart.render(); }
    if (isPie_pl == 1) { petal_length_pie.render(); }
    else { petal_length_chart.render(); }
    if (isPie_pw == 1) { petal_width_pie.render(); }
    else { petal_width_chart.render(); }
	}

  var reRenderNull = function(){
  	reRender();
    if (isPie_s == 1) { species_pie.filter(null); }
    else { species_chart.filter(null); }
    if (isPie_sl == 1) { sepal_length_pie.filter(null); }
    else { sepal_length_chart.filter(null); }
    if (isPie_sw == 1) { sepal_width_pie.filter(null); }
    else { sepal_width_chart.filter(null); }
    if (isPie_pl == 1) { petal_length_pie.filter(null); }
    else { petal_length_chart.filter(null); }
    if (isPie_pw == 1) { petal_width_pie.filter(null); }
    else { petal_width_chart.filter(null); }
  }


  //add a reset button as shown in the tutorial
	var showButton = function(){
    if(species_chart.filters().length > 0 || sepal_length_chart.filters().length > 0 || sepal_width_chart.filters().length > 0 || petal_length_chart.filters().length > 0 || petal_width_chart.filters().length > 0 || species_pie.filters().length > 0 || sepal_length_pie.filters().length > 0 || sepal_width_pie.filters().length > 0 || petal_length_pie.filters().length > 0 || petal_width_pie.filters().length > 0 ){
				d3.select(".dcjs_flower_btn-btn")
          .remove();
        d3.select("#dcjs_flower_resetButton")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn-btn")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Reset"; })
          .on("click", function(){
	            reRenderNull();
          });
    } else {
        d3.select(".dcjs_flower_btn-btn")
          .remove();
    };
};

	//add options to switch between bar and pie charts
	var filterAll = function(){
    if (isPie_s == 1) { species_chart.filter = species_pie.filter; }
    else { species_pie.filter = species_chart.filter; }
    if (isPie_sl == 1) { sepal_length_chart.filter = sepal_length_pie.filter; }
    else { sepal_length_pie.filter = sepal_length_chart.filter; }
    if (isPie_sw == 1) {sepal_width_chart.filter = sepal_width_pie.filter; }
    else { sepal_width_pie.filter = sepal_width_chart.filter; }
    if (isPie_pl == 1) { petal_length_chart.filter = petal_length_pie.filter; }
    else { petal_length_pie.filter = petal_length_chart.filter; }
    if (isPie_pw == 1) {petal_width_chart.filter = petal_width_pie.filter; }
    else { petal_width_pie.filter = petal_width_chart.filter; }
    reRender();
  }

	var switches = function(){
		switchPie();
 	 	switchSpecies();
 	 	switchSepalLength();
 	 	switchSepalWidth();
 	 	switchPetalLength();
  	switchPetalWidth();
	}

	var isPie = 0;
  var switchPie = function(){
  	if(isPie == 0){
        d3.select("#dcjs_flower_switchChart")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Switch ALL to Pie"; })
          .on("click", function(){
          		isPie = 1;
              isPie_s = 1;
              isPie_sl = 1;
              isPie_sw = 1;
              isPie_pl = 1;
              isPie_pw = 1;
							filterAll();
							switches();
            	dc.renderAll("pie");
		    	    d3.select(".dcjs_flower_btn")
		          	.remove();
          });
    } else {
        d3.select("#dcjs_flower_switchChart")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Switch ALL to Bar"; })
          .on("click", function(){
          		isPie = 0;
              isPie_s = 0;
              isPie_sl = 0;
              isPie_sw = 0;
              isPie_pl = 0;
              isPie_pw = 0;
							filterAll();
							switches();
							dc.renderAll("bar");
		    	    d3.select(".dcjs_flower_btn")
		          	.remove();
          });
    	};
	};


	isPie_s = 0;
  var switchSpecies = function(){
  	if(isPie_s == 0){
    		d3.select(".dcjs_flower_btn-s")
		       .remove();
        d3.select("#dcjs_flower_switchSpecies")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn-s")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Switch Species to Pie"; })
          .on("click", function(){
          		isPie_s = 1;
							species_pie.render();
              species_pie.filter = species_chart.filter;
		    	    d3.select(".dcjs_flower_btn-s")
		          	.remove();
              switchSpecies();
          });
    } else {
    		d3.select(".dcjs_flower_btn-s")
		       .remove();
				d3.select("#dcjs_flower_switchSpecies")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn-s")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Switch Species to Bar"; })
          .on("click", function(){
          		isPie_s = 0;
							species_chart.render();
              species_chart.filter = species_pie.filter;
		    	    d3.select(".dcjs_flower_btn-s")
		          	.remove();
              switchSpecies();
          });
    	};
	};

	isPie_sl = 0;
  var switchSepalLength = function(){
  	if(isPie_sl == 0){
    		d3.select(".dcjs_flower_btn-sl")
		       .remove();
        d3.select("#dcjs_flower_switchSepalLength")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn-sl")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Switch Sepal Length to Pie"; })
          .on("click", function(){
          		isPie_sl = 1;
							sepal_length_pie.render();
 //             sepal_length_pie.filter = sepal_length_chart.filter;
		    	    d3.select(".dcjs_flower_btn-sl")
		          	.remove();
              switchSepalLength();
          });
    } else {
    		d3.select(".dcjs_flower_btn-sl")
		       .remove();
        d3.select("#dcjs_flower_switchSepalLength")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn-sl")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Switch Sepal Length to Bar"; })
          .on("click", function(){
          		isPie_sl = 0;
							sepal_length_chart.render();
              sepal_length_chart.filter = sepal_length_pie.filter;
		    	    d3.select(".dcjs_flower_btn-sl")
		          	.remove();
              switchSepalLength();
          });
    	};
	};


	isPie_sw = 0;
  var switchSepalWidth = function(){
  	if(isPie_sw == 0){
    		d3.select(".dcjs_flower_btn-sw")
		       .remove();
        d3.select("#dcjs_flower_switchSepalWidth")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn-sw")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Switch Sepal Width to Pie"; })
          .on("click", function(){
          		isPie_sw = 1;
							sepal_width_pie.render();
              sepal_width_pie.filter = sepal_width_chart.filter;
		    	    d3.select(".dcjs_flower_btn-sw")
		          	.remove();
              switchSepalWidth();
          });
    } else {
    		d3.select(".dcjs_flower_btn-sw")
		       .remove();
        d3.select("#dcjs_flower_switchSepalWidth")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn-sw")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Switch Sepal Width to Bar"; })
          .on("click", function(){
          		isPie_sw = 0;
							sepal_width_chart.render();
              sepal_width_chart.filter = sepal_width_pie.filter;
		    	    d3.select(".dcjs_flower_btn-sw")
		          	.remove();
              switchSepalWidth();
          });
    	};
	};

	isPie_pl = 0;
  var switchPetalLength = function(){
  	if(isPie_pl == 0){
    		d3.select(".dcjs_flower_btn-pl")
		       .remove();
        d3.select("#dcjs_flower_switchPetalLength")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn-pl")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Switch Petal Length to Pie"; })
          .on("click", function(){
          		isPie_pl = 1;
							petal_length_pie.render();
              petal_length_pie.filter = petal_length_chart.filter;
		    	    d3.select(".dcjs_flower_btn-pl")
		          	.remove();
              switchPetalLength();
          });
    } else {
    		d3.select(".dcjs_flower_btn-pl")
		       .remove();
        d3.select("#dcjs_flower_switchPetalLength")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn-pl")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Switch Petal Length to Bar"; })
          .on("click", function(){
          		isPie_pl = 0;
							petal_length_chart.render();
              petal_length_chart.filter = petal_length_pie.filter;
		    	    d3.select(".dcjs_flower_btn-pl")
		          	.remove();
              switchPetalLength();
          });
    	};
	};


	isPie_pw = 0;
  var switchPetalWidth = function(){
  	if(isPie_pw == 0){
    		d3.select(".dcjs_flower_btn-pw")
		       .remove();
        d3.select("#dcjs_flower_switchPetalWidth")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn-pw")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Switch Petal Width to Pie"; })
          .on("click", function(){
          		isPie_pw = 1;
							petal_width_pie.render();
              petal_width_pie.filter = petal_width_chart.filter;
		    	    d3.select(".dcjs_flower_btn-pw")
		          	.remove();
              switchPetalWidth();
          });
    } else {
    		d3.select(".dcjs_flower_btn-pw")
		       .remove();
        d3.select("#dcjs_flower_switchPetalWidth")
          .append("button")
          .attr("type","button")
          .attr("class","dcjs_flower_btn-pw")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Switch Petal Width to Bar"; })
          .on("click", function(){
          		isPie_pw = 0;
							petal_width_chart.render();
              petal_width_chart.filter = petal_width_pie.filter;
		    	    d3.select(".dcjs_flower_btn-pw")
		          	.remove();
              switchPetalWidth();
          });
    	};
	};

  sepal_length_chart.on('filtered', function(){
  	showButton();
    filterAll();
  });
  sepal_width_chart.on('filtered', function(){
  	showButton();
    filterAll();
  });
  petal_length_chart.on('filtered', function(){
  	showButton();
    filterAll();
  });
  petal_width_chart.on('filtered', function(){
  	showButton();
    filterAll();
  });
  species_chart.on('filtered', function(){
  	showButton();
    filterAll();
  });

  sepal_length_pie.on('filtered', function(){
  	showButton();
    filterAll();
  });
  sepal_width_pie.on('filtered', function(){
  	showButton();
    filterAll();
  });
  petal_length_pie.on('filtered', function(){
  	showButton();
    filterAll();
  });
  petal_width_pie.on('filtered', function(){
  	showButton();
    filterAll();
  });
  species_pie.on('filtered', function(){
  	showButton();
    filterAll();
  });

	switches();
	dc.renderAll("bar");

});
