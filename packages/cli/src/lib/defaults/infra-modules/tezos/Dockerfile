FROM oxheadalpha/flextesa:20211221

LABEL       vendor=Blockwatch\ Data\ Inc \
            maintainer="3sky <jakub@blockwatch.cc>" \
            name="blockwatch/flextesa" \
            cx.bwd.arch="x86_64" \
            cx.bwd.os="linux" \
            cx.bwd.build-version=$BUILD_VERSION \
            cx.bwd.build-date=$BUILD_DATE \
            cx.bwd.build-id=$BUILD_ID

COPY ./tezos-test-env.sh /usr/bin/tezos-test-env.sh
RUN chmod 777 /usr/bin/tezos-test-env.sh && adduser -D -g '' tez
USER tez
ENTRYPOINT ["/bin/sh", "-c", "/usr/bin/tezos-test-env.sh startup"]
EXPOSE 20000
