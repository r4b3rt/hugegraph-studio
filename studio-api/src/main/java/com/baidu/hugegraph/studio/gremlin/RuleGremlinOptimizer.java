/*
 * Copyright 2017 HugeGraph Authors
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to You under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

package com.baidu.hugegraph.studio.gremlin;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

/**
 * add some rules for the gremlin code
 */

@Repository("ruleGremlinOptimizer")
public class RuleGremlinOptimizer implements GremlinOptimizer {

    private static final Logger LOG =
            LoggerFactory.getLogger( RuleGremlinOptimizer.class );

    List<String> atomSentences = new ArrayList<>();

    public RuleGremlinOptimizer() {
        atomSentences.add( "g.V\\(\\)" );
        atomSentences.add( "g.E\\(\\)" );
        atomSentences.add( "bothE\\(\\)" );
        atomSentences.add( "bothV\\(\\)" );
    }

    @Override
    public String limitOptimize(String code, Integer limit) {

        LOG.info( "raw: " + code );
        // 1.if the code call count(), return the code immediately
        if (code.contains( "count()" )) {
            return code;
        }
        for (String atomSentence : atomSentences) {
            String targetSentence = atomSentence + ".limit(" + limit + ")";
            code = code.replaceAll( atomSentence, targetSentence );
        }
        LOG.info( "limit: " + code );
        return code;
    }

    @Override
    public String limitOptimize(String code) {
        return limitOptimize( code, 50 );
    }

}