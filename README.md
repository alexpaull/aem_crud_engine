AEM CRUD ENGINE
===============
AEM Crud Engine is a tool that can be used to search the JCR using XPath, QueryBuilder, or a Simple Query UI. The tool allows you to take the results from your query and make bulk updates utilizing Sling Pipes.

This Project was to become more familiar with the under documented Sling Pipes. I provided some documention in the ReadME with sample Sling Pipes.

This Project was not tested for Production use.

This a content package project generated using the AEM Multimodule Lazybones template.

## Setup
This project uses:
* AEM 6.3
* Java 1.8
* Maven 3.2

Bundles:
* Sling Pipes
* Sling Query
* JSON API
* GSON

Maven Includes Used: https://mvnrepository.com
<pre>
<code>
&lt;dependency&gt;
    &lt;groupId&gt;org.apache.sling&lt;/groupId&gt;
    &lt;artifactId&gt;org.apache.sling.pipes&lt;/artifactId&gt;
    &lt;version&gt;1.1.0&lt;/version&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.apache.sling&lt;/groupId&gt;
    &lt;artifactId&gt;org.apache.sling.query&lt;/artifactId&gt;
    &lt;version&gt;3.0.0&lt;/version&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;javax.json&lt;/groupId&gt;
    &lt;artifactId&gt;javax.json-api&lt;/artifactId&gt;
    &lt;version&gt;1.1.2&lt;/version&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.google.code.gson&lt;/groupId&gt;
    &lt;artifactId&gt;gson&lt;/artifactId&gt;
    &lt;version&gt;2.3&lt;/version&gt;
&lt;/dependency&gt;
</code>
</pre>

## Sample SlingPipes API - Based on 1.1.0


 **Echo Simplified xpath, both below return the same**
 
 ```$java
  pipeBuilder.echo("/etc/testpath");
  pipeBuilder.xpath("/jcr:root/etc/testpath");
```
 
 **All nodes recursive**
 
 `pipeBuilder.xpath("/jcr:root/etc/testpath//*");`

 **Child nodes**
 
 `pipeBuilder.xpath("/jcr:root/etc/testpath/*");`

 **Get parent node of results**
 
 `pipeBuilder.parent();`

 **Make directory under result node**
 
 `pipeBuilder.mkdir("heyworld");`

 **Example to show hidden shortcuts**
 
 .mv(destination) equivalent to .pipe("slingPipes/mv").expr(destination)

 ```$java
 pipeBuilder.mv("/jcr:root/etc/testpath2");
 pipeBuilder.pipe("slingPipes/mv").expr("/jcr:root/etc/testpath2").path();
 ```

 **xpath**
 
 ```plumber.newPipe(resolver).xpath("/jcr:root/etc/testpath//[@sling:resourceType=]*").run();```

 **Remove**
 
 ```plumber.newPipe(resolver).xpath("/jcr:root/etc/testpath//*").rm().run();```

 **Move Property**

 ```pipeBuilder.xpath("/jcr:root/etc/testpath").path("/etc/testpath").name("test").mv("${path.test}/heyworld/temp/sample").path("${path.test}/heyworld/child/testing").run();```

 **Write Property**
 
 ```
 plumber.newPipe(resolver).xpath("/jcr:root/etc/testpath//*").write("test","test");
 
 // creates props "1=2" and "3=4"
 pipeBuilder.write("1","2","3","4");
 
 pipeBuilder.pipe("slingPipes/write").conf("temp","other","random","temp");
 ```

 **Conditional**
 
 ```
 pipeBuilder.xpath("/jcr:root/etc/testpath//*").name("item")
    .write("testProp","${(item.testProp === '2' ? '1' : '3')}");
 ```
 
 **Replace**
 
 ```
 pipeBuilder.xpath("/jcr:root/etc/testpath//*").name("item")
    .write("testProp","${item.testProp.replace('0','new')}");
   
 pipeBuilder.xpath("/jcr:root/etc/testpath//*").name("item").write("test", "${item['sling:resourceType'].replace('sling','that')}");
  
 ```

 **test break down chain commands**
 ```$java
 PipeBuilder pipeBuilder = plumber.newPipe(resolver);
 pipeBuilder.xpath("/jcr:root/etc/testpath//*[@testProp]").parent().write("testProp","parent");
 pipeBuilder.run();
```

## Building

This project uses Maven for building. Common commands:

From the root directory, run ``mvn -PautoInstallPackage clean install`` to build the bundle and content package and install to a CQ instance.

From the bundle directory, run ``mvn -PautoInstallBundle clean install`` to build *just* the bundle and install to a CQ instance.

## Using with AEM Developer Tools for Eclipse

To use this project with the AEM Developer Tools for Eclipse, import the generated Maven projects via the Import:Maven:Existing Maven Projects wizard. Then enable the Content Package facet on the _content_ project by right-clicking on the project, then select Configure, then Convert to Content Package... In the resulting dialog, select _src/main/content_ as the Content Sync Root.

## Using with VLT

To use vlt with this project, first build and install the package to your local CQ instance as described above. Then cd to `content/src/main/content/jcr_root` and run

`vlt --credentials admin:admin checkout -f ../META-INF/vault/filter.xml --force http://localhost:4502/crx`

Once the working copy is created, you can use the normal `vlt up` and `vlt ci` commands.

## Specifying CRX Host/Port

The CRX host and port can be specified on the command line with:
mvn -Dcrx.host=otherhost -Dcrx.port=5502 <goals>


