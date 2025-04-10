from django.conf import settings
from django.shortcuts import render

# Create your views here.


def cheers(request):
    return render(request, "example_app/base.html", {"debug": settings.DEBUG})
