# AEM CRUD ENGINE

This a content package project generated using the AEM Multimodule Lazybones template.

## Setup
This project uses AEM 6.3.

Maven Includes Used: https://mvnrepository.com

<dependency>
    <groupId>org.apache.sling</groupId>
    <artifactId>org.apache.sling.pipes</artifactId>
    <version>1.1.0</version>
</dependency>,
<dependency>
    <groupId>org.apache.sling</groupId>
    <artifactId>org.apache.sling.query</artifactId>
    <version>3.0.0</version>
</dependency>,
<dependency>
    <groupId>javax.json</groupId>
    <artifactId>javax.json-api</artifactId>
    <version>1.1.2</version>
</dependency>,
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.3</version>
</dependency>

## Sample SlingPipes API


 // Echo Simplified xpath, both below return the same
 
 pipeBuilder.echo("/etc/testpath");     
 pipeBuilder.xpath("/jcr:root/etc/testpath")

 // all nodes recursive
 
 pipeBuilder.xpath("/jcr:root/etc/testpath//*")

 // child nodes
 
 pipeBuilder.xpath("/jcr:root/etc/testpath/*")

 // get parent node of results
 
 pipeBuilder.parent();


 // make directory under result node
 
 pipeBuilder.mkdir("heyworld");

 // Example to show hidden shortcut, .mv(destination) equivalent to .pipe("slingPipes/mv").expr(destination)

 pipeBuilder.mv("/jcr:root/etc/testpath2");
 pipeBuilder.pipe("slingPipes/mv").expr("/jcr:root/etc/testpath2").path();

 // xpath
 
 //plumber.newPipe(resolver).xpath("/jcr:root/etc/testpath//[@sling:resourceType=]*").run();

 // remove
 
 //plumber.newPipe(resolver).xpath("/jcr:root/etc/testpath//*").rm().run();

 // move
 
 //plumber.newPipe(resolver).xpath("/jcr:root/etc/testpath//*").path("/home/etc").mv("testpath2").run();

 // write
 
 //plumber.newPipe(resolver).xpath("/jcr:root/etc/testpath//*").write("test","test");

 // condtional
 
 pipeBuilder.xpath("/jcr:root/etc/testpath//*").name("item").write("testProp","${(item.testProp === '2' ? '1' : '3')}");
 
 // replace
 
 pipeBuilder.xpath("/jcr:root/etc/testpath//*").name("item").write("testProp","${item.testProp.replace('0','new')}");

 // test break down chain commands
 
 PipeBuilder pipeBuilder = plumber.newPipe(resolver);
 
 pipeBuilder.xpath("/jcr:root/etc/testpath//*[@testProp]").parent().write("testProp","parent");
  
 pipeBuilder.run();

## Building

This project uses Maven for building. Common commands:

From the root directory, run ``mvn -PautoInstallPackage clean install`` to build the bundle and content package and install to a CQ instance.

From the bundle directory, run ``mvn -PautoInstallBundle clean install`` to build *just* the bundle and install to a CQ instance.

## Using with AEM Developer Tools for Eclipse

To use this project with the AEM Developer Tools for Eclipse, import the generated Maven projects via the Import:Maven:Existing Maven Projects wizard. Then enable the Content Package facet on the _content_ project by right-clicking on the project, then select Configure, then Convert to Content Package... In the resulting dialog, select _src/main/content_ as the Content Sync Root.

## Using with VLT

To use vlt with this project, first build and install the package to your local CQ instance as described above. Then cd to `content/src/main/content/jcr_root` and run

    vlt --credentials admin:admin checkout -f ../META-INF/vault/filter.xml --force http://localhost:4502/crx

Once the working copy is created, you can use the normal ``vlt up`` and ``vlt ci`` commands.

## Specifying CRX Host/Port

The CRX host and port can be specified on the command line with:
mvn -Dcrx.host=otherhost -Dcrx.port=5502 <goals>


