var noisy = new Noisy();

var model = new Noisy.Model( { name:"commands" } );

model.load( "http://example.com/model.blob" );

var sample = new Noisy.Sample( { name:"up" , label:"up" } );

sample.allocate( 1000 );

sample.record( );

sample.save( localStorage );


//OR
sample.load( "http://example.com/sound.mp3" );

//OR
sample.load( UInt8Array )


model.train( sample );

model.save( localStorage );


//Load an UInt8Array as a sample and test it!
var test = new Noisy.Sample( { name:"myguess" } );

test.load( UInt8Array );

model.classify( test );

console.log(test.label , test.confidence);


//Listen for events from noisy
var noisyEventListener = function(e) {
	console.log(e.label);
	console.log(e.confidence);
}

noisy.on( "up" , model , noisyEventListener );

noisy.on( "down" , model , noisyEventListener );

noisy.listen( );

