// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

using System;

namespace Microsoft.JavaScript.NodeApi.TestCases;

[JSExport]
public static class Errors
{
    public static void ThrowDotnetError(string message)
    {
        throw new Exception(message);
    }

    public static void ThrowJSError(string message, IJSErrors jsErrors)
    {
        jsErrors.ThrowJSError(message);
    }
}

[JSExport]
public interface IJSErrors
{
    void ThrowJSError(string message);
}
