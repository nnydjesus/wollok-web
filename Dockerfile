FROM phusion/passenger-nodejs:latest

EXPOSE 3000

VOLUME ["/app"]
ADD start.sh /start.sh
RUN chmod 755 /start.sh
CMD ["/start.sh"]