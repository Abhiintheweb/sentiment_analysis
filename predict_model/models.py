from __future__ import unicode_literals



from django.db import models

# Create your models here.


class tweets(models.Model):
  id=models.AutoField(primary_key=True)
  data_tweet_id=models.BigIntegerField()
  # models.CharField(max_length=255) 
  data_user_id=models.CharField(max_length=255)  
  data_permalink_path=models.CharField(max_length=255)
  data_screen_name=models.CharField(max_length=255)
  data_you_follow=models.BooleanField(default=False)
  data_follow_you=models.BooleanField(default=False)
  tweet_text=models.CharField(max_length=128)
  machine_label=models.CharField(max_length=128,default=None)
  human_label=models.CharField(max_length=128,blank=True)
  confidence=models.IntegerField(default=None) 
  created_at=models.DateTimeField(auto_now_add=True)
  updated_at=models.DateTimeField(auto_now=True)
  profile_pic=models.CharField(max_length=255,blank=True)
  is_trainable=models.BooleanField(default=True)


  def __str__(self):              # __unicode__ on Python 2
        return self.id
  def __unicode__(self):
        return u'%s %s' % (self.id, self.data_tweet_id,self.tweet_text,self.is_trainable,self.machine_label,self.human_label)
      
  class Meta:       
        db_table = "tweets"

