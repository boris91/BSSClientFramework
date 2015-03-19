<%@ WebHandler Language="C#" Class="PostProductsHttpHandler" %>

using System;
using System.Web;
using System.IO;

public class PostProductsHttpHandler : IHttpHandler
{
	public void ProcessRequest(HttpContext context)
	{
		string dataFilePath = context.Request.QueryString["filePath"];
		if (!String.IsNullOrEmpty(dataFilePath))
		{
			dataFilePath = context.Server.MapPath(dataFilePath);
			using (var reader = new StreamReader(context.Request.InputStream))
			{
				var writer = new StreamWriter(dataFilePath);
				string postData = reader.ReadToEnd();
				writer.Write(postData);
				context.Response.Write(postData);
			}
		}
	}

	public bool IsReusable
	{
		get
		{
			return false;
		}
	}
}