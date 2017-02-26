<%   
    String userAgent = request.getHeader("User-Agent"); 
    if(userAgent.indexOf("Mozilla")!=-1 && userAgent.indexOf("iPhone")!=-1 || userAgent.indexOf("Android")!=-1 ){   
        response.sendRedirect(request.getContextPath() +"/mobile");   
    }else if(userAgent.indexOf("Opera")!=-1 && userAgent.indexOf("Opera Mini")!=-1 || userAgent.indexOf("BlackBerry")!=-1){   
        response.sendRedirect(request.getContextPath() +"/mobile");   
    }else if(userAgent.indexOf("Mozilla")!=-1 && userAgent.indexOf("Windows")!=-1){   
        response.sendRedirect(request.getContextPath() +"/main");   
        System.out.println("response.sendRedirect:"+request.getContextPath() +"/main");
    }else{   
        response.sendRedirect(request.getContextPath() +"/main");  
        System.out.println("response.sendRedirect:"+request.getContextPath() +"/main");
    }   
%>  