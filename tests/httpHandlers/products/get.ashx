<%@ WebHandler Language="C#" Class="GetProductsHttpHandler" %>

using System;
using System.Web;
using System.IO;

public class GetProductsHttpHandler : IHttpHandler
{

	public void ProcessRequest(HttpContext context)
	{
		string dataFilePath = context.Request.QueryString["filePath"];
		if (!String.IsNullOrEmpty(dataFilePath))
		{
			dataFilePath = context.Server.MapPath(dataFilePath);
			using (var reader = new StreamReader(dataFilePath))
			{
				string fileText = reader.ReadToEnd();
				context.Response.Write(fileText);
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