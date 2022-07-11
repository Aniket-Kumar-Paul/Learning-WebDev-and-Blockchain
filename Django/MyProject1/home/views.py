from unicodedata import name
from django.shortcuts import render, HttpResponse 
from datetime import datetime
from home.models import Contact
from django.contrib import messages

# Create your views here.
def index(request):
    context = {
        'variable': 'this is a variable'
    }
    # (request, <template name>, context) [context is sent to the template html whose keys values can be accessed by {{<variable name> in context object}}]
    return render(request, 'index.html', context) 

def about(request):
    # return HttpResponse("this is about page")
    return render(request, 'about.html')

def services(request):
    return render(request, 'services.html')

def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        desc = request.POST.get('desc')
        contact = Contact(name=name, email=email, phone=phone, desc=desc, date=datetime.today())
        contact.save()
        messages.success(request, 'Your message has been sent')
        
    return render(request, 'contact.html')